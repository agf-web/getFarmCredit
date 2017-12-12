<template>
  <div id="app">
    <FarmCreditFinder/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import FarmCreditFinder from './components/FarmCreditFinder';

export default {
  name: 'app',
  components: {
    FarmCreditFinder
  }
};
</script>

<style>
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
