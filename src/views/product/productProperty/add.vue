<template> 
  <product-property-detail :is-edit='false'></product-property-detail>
</template>
<script>
  import ProductPropertyDetail from './components/ProductPropertyDetail'
  export default {
    name: 'addProductProperty',
    components: { ProductPropertyDetail }
  }
</script>
<style>
</style>


