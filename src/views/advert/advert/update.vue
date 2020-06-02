<template> 
  <advert-detail :is-edit='true'></advert-detail>
</template>
<script>
  import AdvertDetail from './components/AdvertDetail'
  export default {
    name: 'updateAdvert',
    components: { AdvertDetail }
  }
</script>
<style>
</style>
