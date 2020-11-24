<template>
  <header class="header">
    <h1>Shopify App on Nuxt.js and Koa.js</h1>
    <a :href="shopUrl">Shop ({{ shopUrl }})</a>
  </header>
</template>

<script>
export default {
  data() {
    return {
      shopUrl: `https://${process.env.SHOP}`
    }
  }
}
</script>

<style scoped>
.header {
  padding: 32px;
  box-shadow: 0px 3px 3px -3px rgba(0, 0, 0, 0.6);
}
</style>
