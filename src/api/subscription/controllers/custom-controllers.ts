import {factories} from "@strapi/strapi";

export default factories.createCoreController(
  "api::subscription.subscription",
  ({strapi}) => ({
    async createSubscription(ctx) {
      const currentUser = ctx.state.user.id;
      const {tariff_id} = ctx.request.body;
      const date = new Date();
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        currentUser,
        {
          fields: ["username", "email"],
          populate: {subscriptions: true},
        }
      );
      // какого дня оформлена подписка
      let startDay =
        user.subscriptions.length > 0
          ? new Date(user.subscriptions.at(-1).dueToDay)
          : new Date(date.toISOString().split("T")[0]);
      // от какого числа продливать подписку
      let lastDay =
        user.subscriptions.length > 0
          ? new Date(user.subscriptions.at(-1).dueToDay)
          : new Date(date.toISOString().split("T")[0]);

      function addMonth(tariffId: number) {
        switch (tariffId) {
          case 1:
            return new Date(lastDay.setMonth(lastDay.getMonth() + 1))
              .toISOString()
              .split("T")[0];
          case 2:
            return new Date(lastDay.setMonth(lastDay.getMonth() + 3))
              .toISOString()
              .split("T")[0];
          case 3:
            return new Date(lastDay.setMonth(lastDay.getMonth() + 6))
              .toISOString()
              .split("T")[0];
        }
      }

      return await strapi.entityService.create(
        "api::subscription.subscription",
        {
          data: {
            startDay,
            dueToDay: addMonth(tariff_id),
            tariff_id,
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
      console.log(ctx)
    }
  })
);
