"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/limitation/inc",
      handler: "limitation-controllers.inc",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
