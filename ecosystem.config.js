module.exports = {
  apps: [{
    name: "midnightspa",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    cwd: "/var/www/midnightspa",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      NEXT_RUNTIME: "nodejs",
      NEXT_DISABLE_CACHE: "1",
      NEXT_RUNTIME_NODE_ENV: "production",
      NEXT_TELEMETRY_DISABLED: "1",
      NEXT_FORCE_DYNAMIC: "true",
      PRISMA_NO_CACHE: "1"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
