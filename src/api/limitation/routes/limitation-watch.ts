"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/limitation/watchIncrement",
      handler: "limitation-watch.watchIncrement",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
