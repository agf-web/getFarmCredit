<template>
  <div id="CountySearch">
    <div class="CountySearch__head">
      <label>Search by County</label><br>

      <v-select
        :options="counties"
        :placeholder="'Search by County'"
        :on-change="changed"
      />

      <br>

      <label>Searching for: <strong>{{ searchTerm }}</strong></label>
      <hr>
    </div>

    <div class="CountySearch__branchList">
      <p v-if="!branches.length">No Matching Results</p>

      <ul v-if="branches.length">
        <li 
          v-for="(item, index) in branches" 
          :key="index">
          <h4>#{{ index + 1 }} {{ item.Branch }}</h4>
          <p>
            {{ item.Address }}<br>
            {{ item.City }}, {{ item.State }} {{ item.Zip }}
          </p>
          <p>{{ item["Phone 1"] }}</p>

          <h5>Counties Served</h5>
          <p>{{ item.County }}</p>
          <hr>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
  name: 'ag-county-search',
  components: {
    vSelect
  },
  props: ['branches', 'counties'],
  data() {
    return {
      searchTerm: '',
      suggestions: [],
      suggestionAttribute: 'countyName',
      selectedEvent: ''
    };
  },
  mounted() {
    // eslint-disable-next-line
    console.dir('[MOUNTED] Search');
  },
  methods: {
    changed(val) {
      this.$emit('searchedCounty', val);
    }
  }
};
</script>

<style lang="scss">
  .searchbox {
    width: 100%;
  }

  .CountySearch__branchList ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
  }

  .v-select {
    .selected-tag {
      position: absolute;
    }
  }
</style>
