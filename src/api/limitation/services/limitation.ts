/**
 * limitation service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::limitation.limitation', ({ strapi }) => ({
  async watch(ctx) {
    let limit = await strapi.db.query("api::limitation.limitation").findOne(
      {where: {users_permissions_user: ctx.state.user.id}}
    )
    const subscriptions = await strapi.db.query("api::subscription.subscription").findMany({
      where: {
        user_id: ctx.state.user.id,
        isActive: true,
      },
    });
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
    if (!subscriptions.length) {
      limit = await strapi.entityService.update("api::limitation.limitation", limit.id, {
        data: {watchLimit: limit.watchLimit - 1}
      })
    }

    return {message: `watchLimit is ${limit.watchLimit}`, watchLimit: limit.watchLimit, error: false}
  },
  async word(ctx) {
    let limit = await strapi.db.query("api::limitation.limitation").findOne(
      {where: {users_permissions_user: ctx.state.user.id}}
    )
    const subscriptions = await strapi.db.query("api::subscription.subscription").findMany({
      where: {
        user_id: ctx.state.user.id,
        isActive: true,
      },
    });
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
    if (!subscriptions.length) {
      limit = await strapi.entityService.update("api::limitation.limitation", limit.id, {
        data: {translateLimit: limit.translateLimit - 1}
      })
    }

    return {message: `translateLimit is ${limit.translateLimit}`, translateLimit: limit.translateLimit, error: false}
  }
}));
