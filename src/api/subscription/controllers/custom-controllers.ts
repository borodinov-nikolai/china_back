import {factories} from "@strapi/strapi";

export default factories.createCoreController(
  "api::subscription.subscription",
  ({strapi}) => ({
    async createSubscription(ctx) {
      const currentUser = ctx.state.user.id;
      const tariff_id = Number(ctx.request.body.tariff_id);
      const date = new Date();
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        currentUser,
        {
          fields: ["username", "email"],
          populate: {subscriptions: true},
        }
      );
      const tariff = await strapi.entityService.findOne(
        "api::tariff.tariff",
        tariff_id,
        {
          fields: ["month", "price"],
          populate: {subscriptions: true},
        }
      );
      let startDay =
        user.subscriptions.length > 0
          ? new Date(user.subscriptions.at(-1).dueToDay)
          : new Date(date.toISOString().split("T")[0]);
      let lastDay =
        user.subscriptions.length > 0
          ? new Date(user.subscriptions.at(-1).dueToDay)
          : new Date(date.toISOString().split("T")[0]);

      function addMonth(month: number) {
        return new Date(lastDay.setMonth(lastDay.getMonth() + month))
          .toISOString()
          .split("T")[0];
      }

      return await strapi.entityService.create(
        "api::subscription.subscription",
        {
          data: {
            startDay,
            dueToDay: addMonth(tariff.month),
            tariff_id: Number(tariff_id),
            user_id: currentUser,
          },
        }
      );
    },
    async createOrder(ctx) {
      const userId = ctx.state.user.id;
      const {data} = ctx.request.body;
      const  {tariff_id, payment_id} = data
      const order = await strapi.entityService.create("api::order.order", {
        data:
          {
            isPayed: false,
            payment_id: payment_id,
            tariff_id: tariff_id,
            user_id: userId
          }
      })
        return order;
    },
    async payOrder(ctx) {
      const payment = ctx.request.body.object
      if (payment.status == 'succeeded') {
        const order = await strapi.query('api::order.order').update({
          where: { payment_id: payment.id },
          data: {
            isPayed: true,
          },
        });
        ctx = {
          request: {
            body: {
              tariff_id: order.tariff_id
            }
          },
          state: {
            user: {
              id: order.user_id
            }
          }
        }
        return await this.createSubscription(ctx);
      }
    }
  })
);
