module.exports = {
  apps: [
    {
      name: 'meilisearch',
      script: 'meilisearch',
      args: '--http-addr 127.0.0.1:7700',
      env: {
        MEILI_ENV: 'development',
        MEILI_MASTER_KEY: process.env.MEILISEARCH_API_KEY
      }
    },
    {
      name: 'web',
      cwd: './apps/web',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};