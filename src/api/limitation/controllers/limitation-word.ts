import {factories} from "@strapi/strapi";

export default factories.createCoreController(
  "api::limitation.limitation",
  ({strapi}) => ({
    async wordIncrement(ctx) {
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
      if (limit.translateLimit <= 0) {
        return {message: "translateLimit is 0", error: true}
      }
      limit = await strapi.entityService.update("api::limitation.limitation", limit.id, {
        data: {translateLimit: limit.translateLimit - 1}
      })

      return {message: `translateLimit is ${limit.translateLimit}`, translateLimit: limit.translateLimit, error: false}
    },
  })
);
