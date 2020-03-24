module.exports = {
  async index(ctx) {
    const { shop, accessToken } = ctx.session

    if (accessToken) {
      const url = `https://${shop}/admin/api/2020-01/customers.json`
      const headers = {
        'X-Shopify-Access-Token': accessToken
      }

      const response = await fetch(url, { headers }).catch((error) => {
        ctx.status = error.statusCode
        ctx.body = error.error.error_description
      })
      const data = await response.json()
      ctx.body = data
    } else {
      ctx.redirect('/error')
    }
  }
}
