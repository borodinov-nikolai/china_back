import { factories } from "@strapi/strapi";
import { DefaultContext } from "koa";

export default factories.createCoreController(
  "api::subscription.subscription",
  ({ strapi }) => ({
    async createSubscription(ctx: DefaultContext) {
      const { startDay, dueToDay, tariff_id, user_id } = ctx.request.body;
      const entry = await strapi.entityService.create(
        "api::subscription.subscription",
        {
          data: {
            startDay,
            dueToDay,
            tariff_id,
            user_id,
          },
        }
      );
      return entry;
    },
  })
);
