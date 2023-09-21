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
    }
  }