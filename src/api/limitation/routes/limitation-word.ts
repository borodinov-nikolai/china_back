"use strict";

export default  {
  routes: [
    {
      method: "POST",
      path: "/limitation/wordIncrement",
      handler: "limitation-word.wordIncrement",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/limitation/addToDictionary",
      handler: "limitation-word.addToDictionaryIncrement",
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
