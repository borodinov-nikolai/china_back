'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('control-panel')
      .service('myService')
      .getWelcomeMessage();
  },
});
