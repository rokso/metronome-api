const milieu = require('milieu')

const config = milieu('mtn', {
  server: {
    maxResultsLimit: 1000,
    port: 3000
  },

  mongo: {
    url: 'mongodb://localhost/mtn',
    testUrl: 'mongodb://localhost/mtn-test'
  },

  logger: {
    sentry: {
      dsn: ''
    },
    console: {
      level: 'debug',
      timestamp: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      colorize: true
    }
  },

  eth: {
    ipcPath: `${process.env['HOME']}/Library/Ethereum/geth.ipc`,
    tokenShortName: 'GNT',
    tokenAddress: '0xb4c79dab8f259c7aee6e5b2aa729821864227e84',
    tokenDecimals: 18,
    tokenName: 'Golem Network Token',
    tokenDescription: 'Golem Network Token',
    tokenTotalSupply: -1,

    exportStartBlock: 0
  }
})

module.exports = config
