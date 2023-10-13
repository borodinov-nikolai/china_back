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
      method: "DELETE",
      path: "/dictionary/deleteWord/:wordId",
      handler: "dictionary.deleteWord",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "get",
      path: "/dictionary/get",
      handler: "dictionary.getDictionary",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
