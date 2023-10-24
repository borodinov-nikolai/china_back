import {factories} from "@strapi/strapi";

export default factories.createCoreController(
  "api::limitation.limitation",
  ({strapi}) => ({
    async wordIncrement(ctx) {
      return await strapi.service('api::limitation.limitation').word(ctx);
    },
    async addToDictionaryIncrement(ctx) {
      return await strapi.service('api::limitation.limitation').addToDictionaryIncrement(ctx);
    },
  })
);
