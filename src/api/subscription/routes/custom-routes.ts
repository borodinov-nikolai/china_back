"use strict";

export default  {
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
