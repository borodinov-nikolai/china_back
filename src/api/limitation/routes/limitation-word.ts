"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/limitation/wordIncrement",
      handler: "limitation-word.wordIncrement",
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
