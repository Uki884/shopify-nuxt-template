const { SHOP } = process.env

module.exports = () => {
  return async (ctx, next) => {
    if (!ctx.request.query.shop) {
      ctx.request.query.shop = SHOP
    }
    await next()
  }
}
