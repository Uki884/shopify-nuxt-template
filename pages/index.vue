<template>
  <div>
    <ul>
      <li><a href="/api/shop">Shop API</a></li>
      <li><a href="/api/orders">Orders API</a></li>
      <li><a href="/api/customers">Customers API</a></li>
      <li><nuxt-link to="/orders">Orders Page</nuxt-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  layout: 'shopify'
}
</script>

<style scoped>
ul {
  padding: 32px;
}
</style>
