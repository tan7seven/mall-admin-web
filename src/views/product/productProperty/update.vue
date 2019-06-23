<template> 
  <product-property-detail :is-edit='true'></product-property-detail>
</template>
<script>
  import ProductPropertyDetail from './components/ProductPropertyDetail'
  export default {
    name: 'updateProductProperty',
    components: { ProductPropertyDetail }
  }
</script>
<style>
</style>


