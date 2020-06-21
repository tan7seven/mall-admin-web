<template> 
  <advert-Product :is-edit='true'></advert-Product>
</template>
<script>
  import AdvertProduct from './components/AdvertProduct'
  export default {
    name: 'updateAdvertProduct',
    components: { AdvertProduct }
  }
</script>
<style>
</style>
