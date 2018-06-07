<template>
  <gmap-map
    :center="center"
    :options="mapOptions"
    :zoom="2"
    style="position: absolute; width: 100%; height: 100%"
    ref="branchMap"
  >
    <gmap-info-window
      :options="infoWindowOptions"
      :position="infoWindowPos"
      :opened="isInfoWindowOpen"
      @closeInfoWindow="isInfoWindowOpen = false"
    >
      <div class="infoWindowContent">
        <h2 class="infoWindowContent__branch">{{ infoWindowContent.Branch }}</h2>
        <p class="infoWindowContent__address">
          {{ infoWindowContent.Address }}<br>
          {{ infoWindowContent.City }}, {{ infoWindowContent.State }} {{ infoWindowContent.Zip }}
        </p>
        <p class="infoWindowContent__phone">{{ infoWindowContent['Phone 1'] }}</p>
        <a
          :href="infoWindowContent.directionsLink"
          class="infoWindowContent__directions"
          target="_blank"
          rel="external"
        >
          Directions To Location
        </a>
      </div>
    </gmap-info-window>
    <gmap-marker
      v-for="(m, index) in branches"
      @click="openInfoWindow(m, index)"
      :key="index"
      :position="m.location"
      :clickable="true"
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
import * as VueGoogleMaps from 'vue2-google-maps-fixed';
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
        clickableIcons: false,
        gestureHandling: 'cooperative',
        styles: googleMapStyles,
        zoom: 5,
        maxZoom: 18
      },
      mapmarker,
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWindowContent: {},
      isInfoWindowOpen: false,
    };
  },
  mounted () {
    this.centerMap()
  },
  methods: {
    centerMap() {
      let vm = this
      this.$refs.branchMap.$mapPromise.then((map) => {
        if (this.branches.length > 1) {
          map.fitBounds(this.currentBounds);
          map.setCenter(this.currentBounds.getCenter());
        }
        if (this.branches.length === 1) {
          map.fitBounds(this.currentBounds);
          map.setCenter(this.currentBounds.getCenter());
          map.setZoom(18);
        }
        if (this.branches.length === 0) {
          map.setCenter({lat:37.429367,lng:-85.001530});
          map.setZoom(5);
        }
      }).catch((err) => {
        // eslint-disable-next-line
        console.error(err);
      });
    },
    // using object destructuring:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
    openInfoWindow (branchInfo, index) {
      this.infoWindowPos = branchInfo.location;
      this.infoWindowContent = branchInfo;

      this.infoWindowContent.directionsLink = this.mapDirections(branchInfo)

      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === index) {
        this.isInfoWindowOpen = !this.isInfoWindowOpen;
      }
      // if different marker set infowindow to open and reset current marker index
      else {
        this.isInfoWindowOpen = true;
        this.currentMidx = index;
      }
      // console.log(marker);
    },
    closeInfoWindow () {
      this.isInfoWindowOpen = false
    },
    mapDirections (branch) {
      const address = branch.Address.split(' ').join('+').split('-').join('--');
      const city = branch.City.split(' ').join('+');
      const state = branch.State;
      const zip = branch.Zip;

      let googMapLink = `https://www.google.com/maps/search/?api=1&query=${address}+${city}+${state}+${zip}`;
      // Sometimes we need to use a specific Google Maps url
      // to find the right location (see Jay, FL branch)
      if (branch.google_maps_url) {
        googMapLink = branch.google_maps_url;
      }

      return googMapLink;
    }
  },
  computed: {
    currentBounds() {
      let theCurrentBounds = new google.maps.LatLngBounds();
      this.branches.forEach(branch => theCurrentBounds.extend(branch.location));
      return theCurrentBounds;
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.infoWindowContent {
  &__branch {
    color: #5B8F22;
    font-family: 'futura-pt-bold', sans-serif;
    text-transform: uppercase;
    margin: 0;
    font-size: 18px;
  }
  &__directions {
    display: inline-block;
    color: #2c3e50;
    text-decoration: none;
    border-bottom: 1px dotted #9e9e9e;
    &:hover {
      color: #5B8F22;
    }
  }
}
</style>
