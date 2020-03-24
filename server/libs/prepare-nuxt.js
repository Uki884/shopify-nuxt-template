const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
const config = require('../../nuxt.config.js')

module.exports = async (dev = false) => {
  config.dev = dev

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  await nuxt.ready()

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  return nuxt
}
