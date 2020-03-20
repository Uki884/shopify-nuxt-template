const Koa = require('koa')
const session = require('koa-session')
const Router = require('@koa/router')
const { default: shopifyAuth } = require('@shopify/koa-shopify-auth')
const { verifyRequest } = require('@shopify/koa-shopify-auth')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()
const router = new Router()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

function setupShopifyAuth() {
  const { SHOP, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES } = process.env
  app.keys = [SHOPIFY_API_SECRET]

  app.use(session({ secure: true, sameSite: 'none' }, app))
  app.use(async (ctx, next) => {
    if (!ctx.request.query.shop) {
      ctx.request.query.shop = SHOP
    }
    await next()
  })
  app.use(
    shopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      afterAuth(ctx) {
        ctx.redirect('/')
      }
    })
  )
  app.use(verifyRequest())
}

function setupRoutes() {
  const handlers = require('./handlers')

  router.get('/api/shop', handlers.shopApi)
  router.get('/api/orders', handlers.ordersApi)
  router.post('/api/orders/:orderId/cancel', handlers.orderCancelApi)
  router.get('/api/customers', handlers.customersApi)
}

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  setupShopifyAuth()
  setupRoutes()

  router.all('*', (ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.use(router.routes())
  app.use(router.allowedMethods)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
