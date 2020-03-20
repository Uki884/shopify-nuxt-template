const consola = require('consola')

async function shopApi(ctx) {
  const { shop, accessToken } = ctx.session

  if (accessToken) {
    const url = `https://${shop}/admin/api/2020-01/shop.json`
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

async function ordersApi(ctx) {
  const { shop, accessToken } = ctx.session

  if (accessToken) {
    const url = 'https://' + shop + '/admin/api/2020-01/orders.json'
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

async function orderCancelApi(ctx) {
  consola.info(ctx)
  const { shop, accessToken } = ctx.session
  const { orderId } = ctx.request.query

  if (accessToken && orderId) {
    const url = `https://${shop}/admin/api/2020-01/orders/${orderId}/cancel.json`
    const headers = {
      'X-Shopify-Access-Token': accessToken
    }

    const response = await fetch(url, { method: 'POST', headers }).catch(
      (error) => {
        ctx.status = error.statusCode
        ctx.body = error.error.error_description
      }
    )
    const data = await response.json()
    ctx.body = data
  } else {
    ctx.redirect('/error')
  }
}

async function customersApi(ctx) {
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

module.exports = {
  shopApi,
  ordersApi,
  orderCancelApi,
  customersApi
}
