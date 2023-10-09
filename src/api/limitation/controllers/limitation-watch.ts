import {factories} from "@strapi/strapi";

export default factories.createCoreController(
  "api::limitation.limitation",
  ({strapi}) => ({
    async watchIncrement(ctx) {
      let limit = await strapi.db.query("api::limitation.limitation").findOne(
        {where: {users_permissions_user: ctx.state.user.id}}
      )
      if (!limit) {
        limit = await strapi.entityService.create("api::limitation.limitation", {
          data: {
            users_permissions_user: ctx.state.user.id,
          }
        })
      }
      if (limit.watchLimit <= 0) {
        return {message: "watchLimit is 0", error: true}
      }
      limit = await strapi.entityService.update("api::limitation.limitation", limit.id, {
        data: {watchLimit: limit.watchLimit - 1}
      })

      return {message: `watchLimit is ${limit.watchLimit}`, watchLimit: limit.watchLimit, error: false}

    }
  })
);
