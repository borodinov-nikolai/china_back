/**
 * dictionary controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::dictionary.dictionary', ({ strapi }) => ({
  async addWord(ctx) {
      const wordObject = ctx.request.body;
      const userId = ctx.state.user.id;
      return await strapi.service('api::dictionary.dictionary').addWord(wordObject, userId);
  },
  async deleteWord(ctx) {
    const wordId = Number(ctx.request.url.split('/').at(-1));
    const userId = ctx.state.user.id;
    return await strapi.service('api::dictionary.dictionary').deleteWord(wordId, userId);
  },
  async getDictionary(ctx) {
    const userId = ctx.state.user.id;
    return await strapi.service('api::dictionary.dictionary').getDictionary(userId);
  },
  async getRandomTest(ctx) {
    const userId = ctx.state.user.id;
    return await strapi.service('api::dictionary.dictionary').getRandomTest(userId);
  }
}));
