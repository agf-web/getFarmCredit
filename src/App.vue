<template>
  <div id="app">
    <FarmCreditFinder
      :filterCfg="filterConfig"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import lodash from 'lodash';

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
  data() {
    return {
      filterConfig: loadedFilterConfig
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
