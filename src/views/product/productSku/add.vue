<template> 
  <product-sku-detail :is-edit='false'></product-sku-detail>
</template>
<script>
  import ProductSkuDetail from './components/ProductSkuDetail'
  export default {
    name: 'addProduct',
    components: { ProductSkuDetail }
  }
</script>
<style>
</style>
