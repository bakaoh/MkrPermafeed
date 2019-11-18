module.exports = {
  apps: [
    {
      name: "mkrar",
      script: "./mkrar",
      args: '--wallet-file keyfile.json',
      instances: 1,
      exec_mode: "fork",
      cron_restart: "0 * * * *",
      watch: false,
      autorestart: false
    }
  ]
};
