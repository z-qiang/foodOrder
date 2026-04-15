module.exports = {
  apps: [
    {
      name: 'meituan-h5',
      port: '3005',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0'
      }
    }
  ]
};
