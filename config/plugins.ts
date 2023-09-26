export default {
    'srt': {
      enabled: true,
      resolve: './src/plugins/srt'
    },
    upload: {
      config: {
        providerOptions: {
          sizeLimit: 1024 * 1024 * 1024 // 1gb in bytes
        }
      }
    },
    'control-panel': {
      enabled: true,
      resolve: './src/plugins/control-panel'
    },
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          service: process.env.SMTP_SERVICE,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
          pool: true,
          logger: true,
          debug: true,
          maxConnections: 10000
        },
        
        settings: {
          defaultFrom: process.env.DEFAULT_EMAIL,
          defaultReplyTo: process.env.DEFAULT_EMAIL,
        },
      },
    },
  }