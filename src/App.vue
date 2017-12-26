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
