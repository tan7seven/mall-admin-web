<template> 
  <advert-product-detail :is-edit='false'></advert-product-detail>
</template>
<script>
  import AdvertProductDetail from './components/AdvertProductDetail'
  export default {
    name: 'addAdvert',
    components: { AdvertProductDetail }
  }
</script>
<style>
</style>
