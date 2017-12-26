<template>
  <div id="FarmCreditFinder">
    <div class="sidebar">
      <div class="sidebar__body" id="sidebar"
        v-on:scroll="scrolling" 
        ref="sidebar">
        <ag-county-search
          :branches="branchFilter"
          :counties="countyFilter"
          @searchedCounty="updateBranchFilter"
          ref="searchComponent"
        />
      </div>
      <transition name="fade">
        <button v-if="isBackToTop" 
        class="sidebar__backToTop"
        @click="backToTop">Back to Top</button>
      </transition>
      <div class="sidebar__footer">
        <p class="sidebar__footer-copy">Copyright &copy;  2018 AgFirst Farm Credit Bank. All Rights Reserved.</p>
      </div>
    </div>
    <div class="body">
      <ag-map
        :branches="branchFilter"
        ref="mapComponent"
      />
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import zenscroll from 'zenscroll';
import agMap from './Map';
import agCountySearch from './CountySearch';
import branchesFull from '../../static/branches_full.json';

export default {
  name: 'FarmCreditFinder',
  components: {
    agMap,
    agCountySearch
  },
  data() {
    return {
      search: '',
      // results: [],
      errors: [],
      scrollToTop: false,
      sidebarScroll: null
    };
  },
  created() {
    // axios.get('/static/branches_full.json')
    //   .then((res) => { this.results = res.data; })
    //   .catch((e) => { this.errors.push(e); });
  },
  mounted() {
    // eslint-disable-next-line
    console.log('[MOUNTED] FarmCreditFinder');

    const sidebar = document.getElementById('sidebar');
    this.sidebarScroll = zenscroll.createScroller(sidebar, 500, 30);
  },
  methods: {
    updateBranchFilter(searchTerm) {
      this.search = searchTerm;
      this.$refs.mapComponent.centerMap();
    },
    scrolling(event) {
      if (!this.scrollToTop) {
        if (event.target.scrollTop >= 500) {
          this.scrollToTop = true;
        }
      } else if (event.target.scrollTop <= 500) {
        this.scrollToTop = false;
      }
    },
    backToTop() {
      this.sidebarScroll.toY(0);
    }
  },
  computed: {
    branchFilter() {
      const searchTerm = this.search ? this.search : '';
      return branchesFull.filter(branch =>
        branch.County !== '' &&
        branch.County.toLowerCase()
          .indexOf(searchTerm.toLowerCase()) !== -1);
    },
    countyFilter() {
      const allCounties = branchesFull.map(branch =>
        branch.County.split(',')
          .map(item => item.trim())
          .filter(term => term !== ''));
      return this.$lodash.union(...allCounties).sort();
    },
    isBackToTop() {
      return this.scrollToTop;
    }
  }
};
</script>

<style lang="scss" scoped>
#FarmCreditFinder {
  display: flex;
  height: 100vh;

  .sidebar {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: auto;

    @media only screen and (min-width: 768px) {
      flex: 0 0 auto;
      width: 40%;
    }

    @media only screen and (min-width: 1024px) {
      max-width: 420px;
    }

    &__backToTop {
      position: absolute;
      bottom: 3rem;
      right: 1rem;
      z-index: 10;
      background: #678b28;
      color: #fff;
      border: 0;
      padding: .25rem .5rem;
      font-family: 'futura-pt';
      text-transform: uppercase;
      font-size: .75rem;
      border-radius: 3px;
      cursor: pointer;
    }

    &__body {
      overflow: auto;
      height: 100%;
    }

    &__footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #fff;
      padding: 0 1rem;
      text-align: center;

      &:after {
        content: '';
        top: -25px;
        left: 0;
        position: absolute;
        width: 100%;
        height: 25px;
        display: block;
        background-image: linear-gradient(to top, rgba(255,255,255, 1) 0, rgba(255,255,255, 0) 100%);
      }

      &-copy {
        font-family: 'futura-pt', sans-serif;
        font-size: .75rem;
        width: 100%;
      }
    }
  }
  .body {
    display: none;
    position: relative;
    width: 100%;
    height: 100vh;
    border-left: 10px solid #678b28;

    @media only screen and (min-width: 768px) {
      display: block;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
