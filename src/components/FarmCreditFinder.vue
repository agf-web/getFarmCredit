<template>
  <div id="FarmCreditFinder">
    <div class="sidebar">
      <ag-county-search
        :branches="branchFilter"
        :counties="countyFilter"
        @searchedCounty="updateBranchFilter"
      />
    </div>
    <div class="body">
      <ag-map
        :branches="branchFilter"
        :first-branch="firstBranch"
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
    fullBranch() {
      const filtered = branchesFull.map((branch) => {
        branch.County.split(',')
          .map(item => item.trim())
          .filter(term => term !== '');
        return branch;
      });
      return filtered;
    },
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
    },
    firstBranch() {
      return this.branchFilter[0];
    },
    associations() {
      const associations = this.branchFilter.map(branch => branch.Association);
      return this.$lodash.union(...associations).sort();
    }
  }
};
</script>

<style lang="scss" scoped>
  #FarmCreditFinder {
    display: flex;
    height: 100vh;

    .sidebar {
      width: 35%;
      height: 100vh;
      overflow: auto;
      padding: 1em;
    }
    .body {
      position: relative;
      width: 65%;
      height: 100vh;
    }
  }
</style>
