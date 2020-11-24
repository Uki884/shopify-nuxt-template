const Router = require('@koa/router')
const { verifyRequest } = require('@shopify/koa-shopify-auth')
const shopController = require('../controllers/shop-controller')
const ordersController = require('../controllers/orders-controller')
const customersController = require('../controllers/customers-controller')
const customerCommentsController = require('../controllers/customer-comments-controller')
const sessionsController = require('../controllers/sessions-controller')

const router = new Router()

router.get('/sessions', sessionsController.session)

router.get('/customers/:customer_id/comments', customerCommentsController.index)
router.post(
  '/customers/:customer_id/comments',
  customerCommentsController.create
)

const api = new Router()
api.get('/shop', shopController.index)
api.get('/orders', ordersController.index)
api.post('/orders/:orderId/cancel', ordersController.cancel)
api.get('/customers', customersController.index)
router.use('/api', verifyRequest(), api.routes(), api.allowedMethods())

module.exports = router
