const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const cors = require('@koa/cors')
const { verifyRequest } = require('@shopify/koa-shopify-auth')
const consola = require('consola')

const prepareNuxt = require('./libs/prepare-nuxt')
const router = require('./middlewares/routes')
const fillShopQuery = require('./middlewares/fill-shop-query')
const shopifyAuth = require('./middlewares/shopify-auth')

const app = new Koa()

async function start() {
  const dev = app.env !== 'production'
  const nuxt = await prepareNuxt(dev)

  const { SHOPIFY_API_SECRET } = process.env
  app.keys = [SHOPIFY_API_SECRET]

  app.use(session({ secure: true, sameSite: 'none' }, app))
  app.use(cors())
  app.use(bodyParser())

  // Shopify-related middlewares
  app.use(fillShopQuery())
  app.use(shopifyAuth())

  // Route to Nuxt.js
  router.all('*', verifyRequest(), (ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
