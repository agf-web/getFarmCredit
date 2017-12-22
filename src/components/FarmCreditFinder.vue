<template>
  <div id="FarmCreditFinder">
    <div class="sidebar">
      <div class="sidebar__body">
        <ag-county-search
          :branches="branchFilter"
          :counties="countyFilter"
          @searchedCounty="updateBranchFilter"
        />
      </div>
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
import branchesFull from '../../static/branches_full.json';
import agMap from './Map';
import agCountySearch from './CountySearch';

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
      errors: []
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
  },
  methods: {
    updateBranchFilter(searchTerm) {
      this.search = searchTerm;
      this.$refs.mapComponent.centerMap();
    }
  },
  computed: {
    branchFilter() {
      const searchTerm = this.search ? this.search : '';
      return branchesFull.filter(branch =>
        branch.County !== '' &&
        branch.County.toLowerCase()
          .indexOf(searchTerm.toLowerCase()) !== -1
      );
    },
    countyFilter() {
      const allCounties = branchesFull.map(branch =>
        branch.County.split(',')
          .map(item => item.trim())
          .filter(term => term !== '')
      );
      return this.$lodash.union(...allCounties).sort();
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
        width: 35%;
        max-width: 550px;
        min-width: 335px;
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
          background-image: linear-gradient(to top, #fff 0, transparent 100%);
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
</style>
