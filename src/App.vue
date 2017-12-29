<template>
  <div id="app">
    <FarmCreditFinder
      :acaFilter="associationFilter"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import lodash from 'lodash';

import FarmCreditFinder from './components/FarmCreditFinder';
import associationFilterConfig from '../config/app.associationFilterConfig';

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

export default {
  name: 'app',
  components: {
    FarmCreditFinder
  },
  data() {
    return {
      associationFilter: associationFilterConfig
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
