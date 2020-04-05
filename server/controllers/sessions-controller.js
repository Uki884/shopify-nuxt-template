module.exports = {
  async session(ctx) {
    ctx.set("Content-Type", "application/json")
    ctx.body = ctx.session
  }
}
