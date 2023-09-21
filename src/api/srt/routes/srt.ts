export default {
  routes: [
    {
     method: 'POST',
     path: '/srt',
     handler: 'srt.exampleAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/srt',
     handler: 'srt.getAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
