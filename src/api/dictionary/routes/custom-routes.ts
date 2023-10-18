"use strict";

export default  {
  routes: [
    {
      method: "POST",
      path: "/dictionary/addWord",
      handler: "dictionary.addWord",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/dictionary/getRandomTest",
      handler: "dictionary.getRandomTest",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/dictionary/deleteWord/:wordId",
      handler: "dictionary.deleteWord",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/dictionary/getDictionary",
      handler: "dictionary.getDictionary",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
