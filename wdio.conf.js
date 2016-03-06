'use strict'

const path = require('path')

exports.config = {
  specs: [
    'test/integration/**/*.test.js'
  ],
  exclude: [
  ],
  capabilities: [
    {browserName: 'firefox'}
    //{browserName: 'chrome'}
  ],
  logLevel: 'silent',
  coloredLogs: true,
  baseUrl: `file:///${path.resolve(process.cwd(), 'test/fixtures')}`,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd'
  }
}
