<template>
  <table>
    <thead>
      <tr>
        <th>Customer ID</th>
        <th>Email</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="customer in customers" :key="customer.id">
        <td>{{ customer.id }}</td>
        <td>{{ customer.email }}</td>
        <td>{{ customer.tags }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  layout: 'shopify',
  data() {
    return {
      customers: []
    }
  },
  mounted() {
    this.fetchCustomers()
  },
  methods: {
    async fetchCustomers() {
      const response = await this.$axios.$get(
        `${process.env.HOST}/api/customers`
      )
      this.customers = response.customers
      console.log(this.customers)
    }
  }
}
</script>
