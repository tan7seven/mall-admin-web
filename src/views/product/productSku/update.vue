<template> 
  <product-sku-detail :is-edit='true'></product-sku-detail>
</template>
<script>
  import ProductSkuDetail from './components/ProductSkuDetail'
  export default {
    name: 'updateProduct',
    components: { ProductSkuDetail }
  }
</script>
<style>
</style>
