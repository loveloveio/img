module.exports = {
  apps: [
    {
      name: 'meilisearch',
      script: 'meilisearch',
      args: '--http-addr 127.0.0.1:7700',
      env: {
        MEILI_ENV: 'development',
        MEILI_MASTER_KEY: 'jtxLEA5ea-WyPaWJYb6MXVlZJx2mqocsbQ5idz7-X20'
      }
    },
    {
      name: 'web',
      cwd: './apps/web',
      script: 'yarn',
      args: 'start --port 3000',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};