<template> 
  <product-type-detail :is-edit='true'></product-type-detail>
</template>
<script>
  import ProductTypeDetail from './components/ProductTypeDetail'
  export default {
    name: 'updateProductType',
    components: { ProductTypeDetail }
  }
</script>
<style>
</style>


