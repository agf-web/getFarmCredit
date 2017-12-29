<template>
  <gmap-map
    :center="center"
    :options="mapOptions"
    style="position: absolute; width: 100%; height: 100%"
    ref="branchMap"
  >
    <gmap-marker
      v-for="(m, index) in branches"
      @click="center=m.location"
      :key="index"
      :position="m.location"
      :clickable="false"
      :label="{ 
        text: (index + 1).toString(), 
        color: '#fff',
        fontSize: '12'
      }"
      :icon="{ 
        url: mapmarker,
        scaledSize: { width: 32, height: 32 },
      }"
    />
  </gmap-map>
</template>

<script>
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import googleMapsApiKey from './../../config/googleMapsApiKey.local';
import googleMapStyles from './googleMapStyles.json';
import mapmarker from '../../static/img/ui--map-marker.svg';

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: googleMapsApiKey
  }
});

const usaCenter = { lat: 39, lng: -96 };

export default {
  name: 'ag-map',
  // props: ['branches'],
  props: {
    branches: {
      type: Array
    }
  },
  data() {
    return {
      center: usaCenter,
      mapOptions: {
        gestureHandling: 'cooperative',
        styles: googleMapStyles,
        zoom: 5,
        maxZoom: 18
      },
      mapmarker
    };
  },
  async created() {
    await VueGoogleMaps.loaded; // create component when VueGoogleMaps is loaded.

    try {
      this.centerMap();
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
  },
  methods: {
    async centerMap() {
      // console.warn(this.branches);
      this.$refs.branchMap.$mapCreated.then((map) => {
        map.fitBounds(this.currentBounds);
        map.setCenter(this.currentBounds.getCenter());
        if (this.branches.length <= 1) {
          map.setZoom(18);
        }
      }).catch((err) => {
        // eslint-disable-next-line
        console.error(err);
      });
    }
  },
  mounted() {
    this.centerMap();
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
