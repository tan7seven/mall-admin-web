<template> 
  <product-type-detail :is-edit='false'></product-type-detail>
</template>
<script>
  import ProductTypeDetail from './components/ProductTypeDetail'
  export default {
    name: 'addProductType',
    components: { ProductTypeDetail }
  }
</script>
<style>
</style>


