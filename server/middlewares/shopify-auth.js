const { default: shopifyAuth } = require('@shopify/koa-shopify-auth')

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES } = process.env

module.exports = () => {
  return shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET,
    scopes: [SCOPES],
    afterAuth(ctx) {
      ctx.redirect('/')
    }
  })
}
