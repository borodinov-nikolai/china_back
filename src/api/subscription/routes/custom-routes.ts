"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/subscription/create",
      handler: "custom-controllers.createSubscription",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
