<template>
  <div id="app">
    <FarmCreditFinder/>
  </div>
</template>

<script>
import Vue from 'vue';
import lodash from 'lodash';

import FarmCreditFinder from './components/FarmCreditFinder';

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

export default {
  name: 'app',
  components: {
    FarmCreditFinder
  }
};
</script>

<style>
  * {
    box-sizing: border-box;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
  }

  body {
    margin: 0 auto;
  }
</style>
