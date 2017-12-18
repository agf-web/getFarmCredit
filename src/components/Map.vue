<template>

  <gmap-map
    :center="center"
    :zoom="4"
    style="position: absolute; width: 100%; height: 100%"
    ref="branchMap"
  >

      <gmap-marker
        :key="index"
        v-for="(m, index) in branches"
        :position="m.location"
        :clickable="true"
        :label="(index + 1).toString()"
        @click="center=m.location"
      />

  </gmap-map>

</template>

<script>
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import googleMapsApiKey from './../../config/googleMapsApiKey.local';

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: googleMapsApiKey
  }
});

const usaCenter = { lat: 39, lng: -96 };

export default {
  name: 'ag-map',
  props: ['branches', 'firstBranch'],
  data() {
    return {
      center: usaCenter,
      bounds: null
    };
  },
  async created() {
    await VueGoogleMaps.loaded; // create component when VueGoogleMaps is loaded.

    try {
      this.$refs.branchMap.$mapCreated.then((map) => {
        map.fitBounds(this.currentBounds);
        map.setCenter(this.currentBounds.getCenter());
      }).catch((err) => {
        // eslint-disable-next-line
        console.error(err);
      });
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
  },
  methods: {
    centerMap() {
      this.$refs.branchMap.$mapCreated.then((map) => {
        map.fitBounds(this.currentBounds);
        map.setCenter(this.currentBounds.getCenter());
      }).catch((err) => {
        // eslint-disable-next-line
        console.error(err);
      });
    }
  },
  mounted() {
    this.$refs.branchMap.$mapCreated.then((map) => {
      map.fitBounds(this.currentBounds);
      map.setCenter(this.currentBounds.getCenter());
    }).catch((err) => {
      // eslint-disable-next-line
      console.error(err);
    });

    // eslint-disable-next-line
    console.log('[MOUNTED] Map');
  },
  computed: {
    currentBounds() {
      // eslint-disable-next-line
      let theCurrentBounds = new google.maps.LatLngBounds();
      this.branches.forEach(branch => theCurrentBounds.extend(branch.location));
      return theCurrentBounds;
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
