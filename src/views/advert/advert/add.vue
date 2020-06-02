<template> 
  <advert-detail :is-edit='false'></advert-detail>
</template>
<script>
  import AdvertDetail from './components/AdvertDetail'
  export default {
    name: 'addAdvert',
    components: { AdvertDetail }
  }
</script>
<style>
</style>
