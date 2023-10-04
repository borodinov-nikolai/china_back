import { factories } from "@strapi/strapi";
import { DefaultContext } from "koa";

export default factories.createCoreController(
  "api::subscription.subscription",
  ({ strapi }) => ({
    async createSubscription(ctx: DefaultContext) {
      const currentUser = ctx.state.user.id;
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        currentUser,
        {
          fields: ["username", "email"],
          populate: { subscription: true },
        }
      );
      const { tariff_id } = ctx.request.body;
      const date = new Date();
      const startDay = !user.subscription
        ? date.toISOString().split("T")[0]
        : new Date(user.subscription.startDay);
      function addMonth(dayStart: any, tariff: number) {
        const newDay = !user.subscription
          ? new Date(dayStart)
          : new Date(user.subscription.dueToDay);
        switch (tariff) {
          case 1:
            return new Date(newDay.setMonth(newDay.getMonth() + 1));
          case 2:
            return new Date(newDay.setMonth(newDay.getMonth() + 3));
          case 3:
            return new Date(newDay.setMonth(newDay.getMonth() + 6));
        }
      }
      const entry = await strapi.entityService.create(
        "api::subscription.subscription",
        {
          data: {
            startDay,
            dueToDay: addMonth(startDay, tariff_id),
            tariff_id,
            user: currentUser,
          },
        }
      );
      return entry;
    },
  })
);
