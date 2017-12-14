<template>
  <div id="FarmCreditFinder">
    <div class="sidebar">
      <ag-county-search
        :branches="branchFilter"
        @searchedCounty="updateBranchFilter"
      ></ag-county-search>
    </div>
    <div class="body">
      <ag-map
        :branches="branchFilter"
        :firstBranch="firstBranch"
      ></ag-map>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
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
      branches: this.branchFilter,
      results: [],
      errors: [],
      counties: (()=>{
        var allCounties = branchesFull.map((branch) => {
          return branch.County.split(',').map(item=>item.trim()).filter(term=>term !== '');
        });

        return _.union(...allCounties).sort();
      })()
    }
  },
  created() {
    axios.get('/static/testData.json')
      .then((res) => { this.results = res.data; })
      .catch((e) => { this.errors.push(e); });
  },
  mounted() {
    // console.log( this.counties );
  },
  methods: {
    updateBranchFilter(searchTerm) {
      this.search = searchTerm;
    }
  },
  computed: {
    fullBranch() {
      let filtered = branchesFull.map(branch => {
        branch.County.split(',').map(item => item.trim()).filter(term => term !== '');
        return branch;
      });
      return filtered;
    },
    branchFilter() {
      return branchesFull.filter((branch) => {
        return branch.County !== '' 
        && branch.County.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      });
    },
    firstBranch() {
      return this.branchFilter[0];
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
