module.exports = {
  apps: [
    {
      name: 'creative-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    }
  ]
}