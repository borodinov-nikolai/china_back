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
    {
      method: "POST",
      path: "/subscription/order",
      handler: "custom-controllers.createOrder",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/subscription/paymentSucces",
      handler: "custom-controllers.payOrder",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
