import cronTasks from "./cron-tasks";

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('BACKEND_URL'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
