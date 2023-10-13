"use strict";

export default  {
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
