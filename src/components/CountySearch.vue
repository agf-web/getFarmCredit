<template>
  <div id="CountySearch">
    <div class="CountySearch__head">
      <h1>Find a Location</h1>
      <p class="intro">
        We provide loans to farmers and rural home buyers in rural counties across 15 states and Puerto Rico. Simply enter your county in the search box below to find the location that serves you.
      </p>
      
      <label @click="focusOnSearch">Search by County</label><br>
      <v-select
        :options="counties"
        :placeholder="'Enter your County'"
        :on-change="changed"
        :value.sync="searchTerm"
        ref="searchbox"
      />
      <br>
      <button @click="clearSearch">Clear Search</button>
    </div>

    <div class="CountySearch__branchList">
      <p v-if="!branches.length">No Matching Results</p>

      <ul v-if="branches.length">
        <li v-for="(item, index) in branches" :key="index">
          <h3>#{{ index + 1 }} {{ item.Branch }}</h3>
          <p>
            {{ item.Address }}<br>
            {{ item.City }}, {{ item.State }} {{ item.Zip }}
          </p>
          <p v-if="item['Phone 1']">
            <strong>Phone:</strong> <a :href="phoneLink(item['Phone 1'])">{{ item['Phone 1'] }}</a>
          </p>
          <p v-if="item['Phone 2']">
            <strong>Phone 2:</strong> <a :href="phoneLink(item['Phone 2'])">{{ item['Phone 2'] }}</a>
          </p>
          <p v-if="item['Fax']">
            <strong>Fax:</strong> {{ item['Fax'] }}
          </p>
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
      searchTerm: null,
      suggestionAttribute: 'countyName'
    };
  },
  mounted() {
    // eslint-disable-next-line
    console.dir('[MOUNTED] Search');
  },
  methods: {
    focusOnSearch() {
      this.$refs.searchbox.$el.children[0].children[0].focus();
    },
    clearSearch() {
      this.$refs.searchbox.mutableValue = null;
    },
    changed(val) {
      this.$emit('searchedCounty', val);
    },
    phoneLink(phoneNum) {
      return `tel:${phoneNum.replace(' ', '-')}`;
    }
  }
};
</script>

<style lang="scss">
  .searchbox {
    width: 100%;
  }

  .intro {
    margin-top: 0;
  }

  .CountySearch {
    &__head {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 1rem;
    }

    &__branchList {
      a {
        color: #2c3e50;
        text-decoration: none;
        border-bottom: 1px dotted #9e9e9e;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0 auto;

        li {
          border-bottom: 1px solid #e0e0e0;

          &:last-child {
            border: 0;
          }
        }
      }
    }
  }

  .v-select {
    .selected-tag {
      position: absolute;
    }
  }
</style>
