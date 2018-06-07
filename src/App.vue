<template>
  <div id="app">
    <FarmCreditFinder
      v-if="branches.length > 0"
      :filterCfg="filterConfig"
      :branches="branches"
    />
    <p v-if="error.length > 0">{{ error }}</p>
  </div>
</template>

<script>
import Vue from 'vue';
import lodash from 'lodash';
import axios from 'axios';

import FarmCreditFinder from './components/FarmCreditFinder';
// import filterConfig from '../config/app.filterConfig';

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

const defaultFilterConfig = { byAssociation: false, byState: false };
const loadedFilterConfig = window.AGF_CONFIG ? window.AGF_CONFIG : defaultFilterConfig;

export default {
  name: 'app',
  components: {
    FarmCreditFinder
  },
  created () {
    let dataURL = `https://www.getfarmcredit.com/locations_feed?key=${this.filterConfig.authKey}`
    axios.get(dataURL)
      .then(response => {
        if (typeof response.data[0] === 'string') {
          this.error = 'Invalid auth key'
        } else {
          this.branches = this.$lodash.orderBy(response.data, ['Branch'])
          //console.log(this.branches)
        }
      })
      .catch(e => {
        this.errors.push(e)
      })
    //this.branches = this.$lodash.orderBy(appData, ['Branch'])
  },
  data () {
    return {
      filterConfig: loadedFilterConfig,
      error: '',
      branches: []
    };
  }
};
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  #app {
    font-family: 'Georgia', 'Times New Roman', Times, serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #000;
  }

  body {
    margin: 0 auto;
    scroll-behavior: smooth;
  }
</style>
