<template>
  <div>
    <gmap-map
      :center="firstBranchLocation"
      :zoom="4"
      style="position: absolute; width: 100%; height: 100%"
    >
      <gmap-cluster>
        <gmap-marker
          :key="index"
          v-for="(m, index) in this.branches"
          :position="m.location"
          :clickable="true"
          :label="(index + 1).toString()"
          @click="center=m.location"
        ></gmap-marker>
      </gmap-cluster>
    </gmap-map>
  </div>

</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: ''
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
