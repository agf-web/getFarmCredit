<template>
  <div id="FarmCreditFinder">
    <div class="sidebar">
      <div class="sidebar__body" id="sidebar"
        v-on:scroll="scrolling" 
        ref="sidebar">
        <ag-county-search
          :branches="branchFilter"
          :counties="countyFilter"
          :config="filterCfg"
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
import appData from '../../static/appData.json';

export default {
  name: 'FarmCreditFinder',
  props: {
    filterCfg: {
      type: Object
    }
  },
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
      sidebarScroll: null,
      branchData: null
    };
  },
  created () {
    this.branchData = this.$lodash.orderBy(appData, ['Branch'])
  },
  mounted() {
    const sidebar = document.getElementById('sidebar');
    this.sidebarScroll = zenscroll.createScroller(sidebar, 500, 30);
  },
  methods: {
    updateBranchFilter(searchTerm) {
      this.search = searchTerm;
      this.$refs.mapComponent.centerMap();
      this.$refs.mapComponent.closeInfoWindow();
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
      // set search term to filter by
      const searchTerm = this.search ? this.search.toLowerCase() : '';

      // if this build IS CONFIGURED to filter by ASSOCIATION
      if (this.filterCfg.byAssociation && typeof this.filterCfg.associationName() === 'string') {
        return this.branchData.filter(branch =>
          branch.Association === this.filterCfg.associationName() &&
            ((branch.County.length
              && branch.County.toLowerCase().indexOf(searchTerm) !== -1) ||
            (branch.CountyPartial.length
              && branch.CountyPartial.toLowerCase().indexOf(searchTerm) !== -1)))
      }

      // if this build IS CONFIGURED to filter by STATE
      if (this.filterCfg.byState && typeof this.filterCfg.stateName === 'string') {
        return this.branchData.filter(branch =>
          branch.State.toLowerCase() === this.filterCfg.stateName.toLowerCase() &&
            ((branch.County !== ''
                && branch.County.toLowerCase().indexOf(searchTerm) !== -1) ||
              (branch.CountyPartial !== ''
                && branch.CountyPartial.toLowerCase().indexOf(searchTerm) !== -1)));
      }

      // if this build is NOT CONFIGURED to be filtered
      return this.branchData.filter(branch =>
        (branch.County !== '' &&
        branch.County.toLowerCase()
          .indexOf(searchTerm) !== -1) ||
        (branch.CountyPartial !== '' &&
        branch.CountyPartial.toLowerCase()
          .indexOf(searchTerm) !== -1))
    },
    countyFilter() {
      // go through branch array and get the County to make a new array.
      // `branch.County` is a string of Counties separated by commas.
      // we convert the string into an array using `split()` and iterating
      // over the Counties by using `map()` and `filter()`.

      let allCounties;
      let allPartialCounties;

      if (this.filterCfg.byAssociation && typeof this.filterCfg.associationName() === 'string') {
        // FILTERED BY ASSOCIATION
        allCounties = this.branchData.filter(branch =>
          branch.Association === this.filterCfg.associationName())
          .map(branch =>
            branch.County.split(',')
              .map(county => county.trim())
              .filter(county => county !== ''))
        allPartialCounties = this.branchData.filter(branch =>
          branch.Association === this.filterCfg.associationName())
          .map(branch => {
            if (branch.CountyPartial) {
              return branch.CountyPartial.split(',')
                .map(county => county.trim())
                .filter(county => county !== '')
            }
          })
      } else if (this.filterCfg.byState && typeof this.filterCfg.stateName === 'string') {
        // FILTERED BY STATE
        allCounties = this.branchData.filter(branch =>
          branch.State.toLowerCase() === this.filterCfg.stateName.toLowerCase())
          .map(branch =>
            branch.County.split(',')
              .map(county => county.trim())
              .filter(county => county !== ''))
        allPartialCounties = this.branchData.filter(branch =>
          branch.State.toLowerCase() === this.filterCfg.stateName.toLowerCase())
          .map(branch => {
            if (branch.CountyPartial) {
              return branch.CountyPartial.split(',')
                .map(county => county.trim())
                .filter(county => county !== '')
            }
          })
      } else {
        // NO FILTERING
        allCounties = this.branchData.map(branch => {
          return branch.County.split(',')
            .map(county => county.trim())
            .filter(county => county !== '')
        })
        allPartialCounties = this.branchData.map(branch => {
          if (branch.CountyPartial) {
            return branch.CountyPartial.split(',')
              .map(county => county.trim())
              .filter(county => county !== '')
          }
        })
      }

      // using lodash to flatten the array of County arrays,
      // removing duplicates with `lodash.union()`, then we sort it.
      return this.$lodash.union(...allCounties,...allPartialCounties).sort();
    },
    isBackToTop() {
      return this.scrollToTop;
    }
    // function to make the list of Associations.
    // copied the Object to `app.filterConfig.js`
    // this is commented out if we need to use this again in the future,
    // if we are still manually updating the `branches_full.json` file.
    //
    // associ() {
    //   const allAssociations = branchesFull.map(branch => {
    //     return branch.Association;
    //   });
    //   return this.$lodash.union(allAssociations).sort();
    // },
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
      bottom: 48px;
      right: 16px;
      z-index: 10;
      background: #5B8F22;
      color: #fff;
      border: 0;
      padding: 4px 8px;
      font-family: 'futura-pt';
      text-transform: uppercase;
      font-size: 12px;
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
      padding: 0 16px;
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
        font-size: 12px;
        width: 100%;
      }
    }
  }
  .body {
    display: none;
    position: relative;
    width: 100%;
    height: 100vh;
    border-left: 10px solid #5B8F22;

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
