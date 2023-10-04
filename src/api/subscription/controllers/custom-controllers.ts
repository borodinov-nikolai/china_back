import { factories } from "@strapi/strapi";
import { DefaultContext } from "koa";

export default factories.createCoreController(
  "api::subscription.subscription",
  ({ strapi }) => ({
    async createSubscription(ctx: DefaultContext) {
      const currentUser = ctx.state.user.id;
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        31,
        {
          fields: ["username", "email"],
          populate: { subscription: true },
        }
      );
      console.log(user);
      const { tariff_id } = ctx.request.body;
      const date = new Date();
      let startDay = !user.subscription
        ? date.toISOString().split("T")[0]
        : new Date(user.subscription.startDay);
      let lastDay;
      function addMonth(tariff: number) {
        lastDay = !user.subscription
          ? new Date(date.toISOString().split("T")[0])
          : new Date(user.subscription.dueToDay);
        switch (tariff) {
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
      // console.log(lastDay , 'last day');
      // console.log(date.toISOString().split("T")[0], 'isos')
      // console.log(new Date(user.subscription.dueToDay), "user lsat duetoday");
      const entry = await strapi.entityService.create(
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
      return entry;
    },
  })
);
