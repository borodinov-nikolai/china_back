import {factories} from "@strapi/strapi";

export default factories.createCoreController(
  "api::limitation.limitation",
  ({strapi}) => ({
    async watchIncrement(ctx) {
      return await strapi.service('api::limitation.limitation').watch(ctx);
    }
  })
);
