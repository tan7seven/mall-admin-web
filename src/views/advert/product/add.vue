<template> 
  <advert-Product :is-edit='false'></advert-Product>
</template>
<script>
  import AdvertProduct from './components/AdvertProduct'
  export default {
    name: 'addAdvertProduct',
    components: { AdvertProduct }
  }
</script>
<style>
</style>
