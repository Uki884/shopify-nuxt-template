const comments = {}

module.exports = {
  index(ctx) {
    ctx.body = comments[ctx.params.customer_id] || []
  },
  create(ctx) {
    const cid = ctx.params.customer_id
    if (!comments[cid]) {
      comments[cid] = []
    }
    comments[cid].push(ctx.request.body.comment)
    ctx.status = 201
  }
}
