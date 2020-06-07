<template> 
  <advert-product-detail :is-edit='true'></advert-product-detail>
</template>
<script>
  import AdvertProductDetail from './components/AdvertProductDetail'
  export default {
    name: 'updateAdvert',
    components: { AdvertProductDetail }
  }
</script>
<style>
</style>
