<template>
  <div id="CountySearch">
    <div class="CountySearch__head">
      <span class="logo">
        <a href="https://www.getfarmcredit.com">GetFarmCredit.com</a>
      </span>
      <h1 class="CountySearch__title">Find a Location</h1>
      <p class="CountySearch__intro">
        We provide loans to farmers and rural home buyers in rural counties across 15 states and Puerto Rico. Simply enter your county in the search box below to find the location that serves you.
      </p>
    </div>

    <div class="CountySearch__body">
      <div class="CountySearch__search">
        <div class="CountySearch__input">
          <v-select
            :options="counties"
            :placeholder="'Enter your County'"
            :on-change="changed"
            :value.sync="searchTerm"
            ref="searchbox"
          />
        </div>
        <div class="CountySearch__clear">
          <button @click="clearSearch" class="btn-clear">Clear Search</button>
        </div>
      </div>

      <div class="CountySearch__branchList">
        <p v-if="!branches.length">No Matching Results</p>
        <transition-group name="branchFade" tag="ul" v-if="branches.length" class="branches">
          <li v-for="(item, index) in branches" :key="index" class="branch">
            <div class="branch__position">
              <p class="branch__position-number">#{{ index + 1 }}</p>
            </div>
            <div class="branch__info">
              <h3 class="branch__title">{{ item.Branch }}</h3>
              <p>
                {{ item.Address }}<br>
                {{ item.City }}, {{ item.State }} {{ item.Zip }}
              </p>
              <p>
                <a :href="mapLink(item)" target="_blank">Directions</a>
              </p>
              <br>
              <p v-if="item['Phone 1']">
                <strong>Phone:</strong> <a :href="phoneLink(item['Phone 1'])">{{ item['Phone 1'] }}</a>
              </p>
              <p v-if="item['Phone 2']">
                <strong>Phone 2:</strong> <a :href="phoneLink(item['Phone 2'])">{{ item['Phone 2'] }}</a>
              </p>
              <p v-if="item['Fax']">
                <strong>Fax:</strong> {{ item['Fax'] }}
              </p>
            </div>
          </li>
        </transition-group>
      </div>
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
  props: {
    branches: {
      type: Array
    },
    counties: {
      type: Array
    }
  },
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
    clearSearch() {
      this.$refs.searchbox.mutableValue = null;
    },
    changed(val) {
      this.$emit('searchedCounty', val);
    },
    phoneLink(phoneNum) {
      return `tel:${phoneNum.replace(' ', '-')}`;
    },
    mapLink(branch) {
      const address = branch.Address.split(' ').join('+');
      const city = branch.City.split(' ').join('+');
      const state = branch.State;
      const zip = branch.Zip;

      const googMapLink = `https://www.google.com/maps/search/?api=1&query=${address}+${city}+${state}+${zip}`;
      return googMapLink;
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  display: block;
  padding: 1rem;

  a {
    display: block;
    background: url('./../../static/img/logo-getfarm.png') center center no-repeat;
    background-size: contain;
    margin: 0 auto;
    text-indent: -9999px;
    width: 230px;
    height: 70px;
    max-width: 100%;
  }
}

.searchbox {
  width: 100%;
}

.CountySearch {
  &__title {
    font-family: 'futura-pt', sans-serif;
    background: #678b28;
    color: #fff;
    padding: .75rem 1.5rem;
    text-transform: uppercase;
    margin: 0;
  }

  &__intro {
    margin: 0;
    padding: 1.5rem 1.5rem;
    background: #494949;
    color: #fff;
    font-size: 0.938rem;
  }

  &__body {
    padding: 1rem;
  }

  &__search {
    justify-content: space-between;
    align-items: center;
    padding: 0 .5rem 1rem;

    @media only screen and (min-width: 480px) {
      display: flex;
    }

    @media only screen and (min-width: 768px) {
      display: block;
    }

    @media only screen and (min-width: 1024px) {
      display: flex;
    }
  }

  &__input {
    flex: 1 0 auto;
    padding-right: 1rem;

    // `/deep/` makes this scoped style available to child components
    // in this case, overriding the 3rd party child component `v-select`
    & /deep/ .v-select {
      &,
      input {
        font-family: 'Georgia', 'Times New Roman', Times, serif;
      }

      input[type="search"],
      input[type="search"]:focus {
        padding-left: 1.25rem;
        padding-right: 1.25rem;
      }

      .open-indicator {
        &:before {
          border-width: 1px 1px 0 0;
        }
      }

      .dropdown-toggle {
        border-radius: 3px;
        background: #eff1ed;
        border: 0;
      }

      .dropdown-menu {
        background: #eff1ed;
        border: 0;

        li.no-options {
          margin: 0 .5rem;
        }
      }

      .selected-tag {
        position: absolute;
        left: 0;
        padding-left: 1rem;
      }
    }
  }

  &__clear {
    flex: 0 0 auto;
    margin: 1rem 0 0;

    @media only screen and (min-width: 480px) {
      margin: 0 auto;
    }

    @media only screen and (min-width: 768px) {
      margin: 1rem 0 0;
    }

    @media only screen and (min-width: 1024px) {
      margin: 0 auto;
    }

    .btn-clear {
      appearance: none;
      border: 0;
      background: transparent;
      text-decoration: underline;
      color: #678b28;
      font-family: "futura-pt", sans-serif;
      font-size: 1rem;
      cursor: pointer;
      margin: 0 auto;
      display: block;

      &:hover {
        text-decoration: none;
      }
    }
  }
}

.branches {
  list-style: none;
  padding: 0;
  margin: 0 auto 2.5rem;

  li {
    border-bottom: 1px solid #e0e0e0;
    &:last-child {
      border: 0;
    }

    a {
      color: #2c3e50;
      text-decoration: none;
      border-bottom: 1px dotted #9e9e9e;
    }
  }
}

.branch {
  padding: 1rem 0;
  display: flex;
  align-items: center;

  &__position-number {
    font-size: 2rem;
    font-family: 'futura-pt-bold', sans-serif;
    color: #989898;
  }

  &__title {
    color: #678b28;
    font-family: 'futura-pt-bold', sans-serif;
    text-transform: uppercase;
    margin: 0;
  }

  &__info {
    margin-left: 1rem;
  }

  p {
    margin: 0;
    line-height: 1.4;
  }
}

.branchFade-enter-active, .branchFade-leave-active {
  transition: all 0.25s ease-out;
}

.branchFade-enter {
  // transform: translate(-50%);
  opacity: 0;
}

.branchFade-leave-to {
  // transform: translate(50%);
  opacity: 0;
}
</style>
