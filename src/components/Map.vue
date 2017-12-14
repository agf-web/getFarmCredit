<template>

  <gmap-map
    :center="firstBranchLocation"
    :zoom="4"
    style="position: absolute; width: 100%; height: 100%"
  >
    <gmap-cluster>
      <gmap-marker
        :key="index"
        v-for="(m, index) in branches"
        :position="m.location"
        :clickable="true"
        :label="(index + 1).toString()"
        @click="center=m.location"
      />
    </gmap-cluster>
  </gmap-map>

</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import googleMapsApiKey from './../../config/googleMapsApiKey.local.js';

Vue.use(VueGoogleMaps, {
  load: {
    key: googleMapsApiKey
  }
});

const usaCenter = {lat: 39, lng: -96 };

export default {
  name: 'ag-map',
  props: ['branches', 'firstBranch'],
  components: {
    VueGoogleMaps
  },
  data() {
    return {
      center: usaCenter
    };
  },
  computed: {
    firstBranchLocation() {
      return this.firstBranch ? this.firstBranch.location : usaCenter;
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
