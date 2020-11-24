<template>
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Email</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ order.email }}</td>
        <td><button @click="cancelOrder(order.id)">Cancel</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      orders: []
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      const response = await this.$axios.$get(`${process.env.HOST}/api/orders`)
      this.orders = response.orders
    },
    async cancelOrder(orderId) {
      await this.$axios.$post(
        `${process.env.HOST}/api/orders/${orderId}/cancel`
      )
    }
  }
}
</script>
