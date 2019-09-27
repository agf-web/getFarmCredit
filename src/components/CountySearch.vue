<template>
  <div id="CountySearch">
    <div class="CountySearch__head">
      <span class="logo" v-if="!disableLogo">
        <a href="https://www.getfarmcredit.com" v-bind:style="customLogo">GetFarmCredit.com</a>
      </span>
      <h1 class="CountySearch__title" v-if="!disableTitle">Find a Location</h1>
      <p class="CountySearch__intro">
        <span v-if="!customIntro">
          We provide loans to farmers and rural home buyers in rural counties across 18 states and Puerto Rico. Simply enter your county in the search box below to find the location that serves you. For locations outside of our 18 state territory, please visit <a href="https://farmcredit.com/" rel="external">Farmcredit.com</a>.
        </span>
        <span v-else v-html="this.config.customIntro.text"></span>
      </p>
    </div>

    <div class="CountySearch__body">
      <div class="CountySearch__type">
        <h4>Search by:</h4>
        <div class="field-radio">
          <input type="radio" id="search-type-county" v-model="searchType" value="county" @change="searchTypeChanged"><label v-if="!this.config.countyValue" for="search-type-county">County</label><label v-else v-html="this.config.countyValue" for="search-type-county"></label>
        </div>
        <div class="field-radio">
          <input type="radio" id="search-type-zip" v-model="searchType" value="zip" @change="searchTypeChanged"><label for="search-type-zip">Zip Code</label>
        </div>
      </div>
      <div class="CountySearch__search">
        <div class="CountySearch__input">
          <label for="search-county-zip">Enter your Zip Code</label>
          <input id="search-county-zip" type="text" class="CountySearch__zip" placeholder="Enter your Zip Code" v-model="zip" @keyup="zipChanged" v-show="searchType === 'zip'">
          <p class="CountySearch__zip-message" v-show="countyOverlap">Multiple branches were found for your zip code. Please enter your county.</p>
          <v-select
            v-show="this.config.countyEnter && (searchType === 'county' || countyOverlap)"
            :options="filteredCounties"
            :placeholder="this.config.countyEnter"
            :on-change="countyChanged"
            :value.sync="county"
            ref="searchbox"
          />
          <v-select
            v-show="(!(this.config.countyEnter)) && (searchType === 'county' || countyOverlap)"
            :options="filteredCounties"
            :placeholder="this.config.countyEnter"
            :on-change="countyChanged"
            :value.sync="county"
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
          <li v-for="(item, index) in branches" :key="item.Nid" class="branch">
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
              <p v-if="hasUrl(item)">
                <strong>Web:</strong>
                <a :href="item['detail_url'] ? item['detail_url'] : item['website']">
                  {{ item['detail_url'] ? 'Branch Details' : item['website'] }}
                </a>
              </p>
              <p v-if="item.CountyPartial === county" class="disclaimer">
                <em>Please call to confirm that this branch serves your location.</em>
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
import axios from 'axios';

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
    },
    config: {
      type: Object
    }
  },
  created () {
    this.filteredCounties = this.counties
  },
  data() {
    return {
      county: '',
      zip: '',
      suggestionAttribute: 'countyName',
      searchType: 'county',
      filteredCounties: []
    };
  },
  methods: {
    clearSearch () {
      let vm = this;
      vm.county = '';
      vm.filteredCounties = vm.counties
      vm.zip = '';
      vm.$refs.searchbox.mutableValue = null;
      vm.$emit('searched', { zip: vm.zip, county: [] });
    },
    searchTypeChanged () {
      this.clearSearch();
    },
    countyChanged (val) {
      let vm = this;
      if (val === null) {
        val = '';
      }
      vm.county = val;
      if (vm.county.length > 0) {
        vm.$emit('searched', { zip: vm.zip, county: [vm.county] })
      } else {
        vm.$emit('searched', { zip: vm.zip, county: [] })
      }
    },
    zipChanged (e) {
      let vm = this;
      vm.county = '';
      vm.filteredCounties = []
      vm.$refs.searchbox.mutableValue = null;
      // Input validation
      if (vm.zip.length >= 5) {
        vm.zip = vm.zip.substring(0,5)
      }
      if (isNaN(vm.zip.substr(vm.zip.length - 1))) {
        vm.zip = vm.zip.substring(0,vm.zip.length - 1)
      }
      // Get the counties for this zip code
      if (vm.zip.length === 5) {
        let zipLookupURL = `https://www.getfarmcredit.com/locations_counties_by_zip?key=${vm.config.authKey}&zip=${vm.zip}`
        axios.get(zipLookupURL)
          .then(response => {
            console.log(response.data)
            vm.filteredCounties = response.data
            // Then search
            vm.$emit('searched', { zip: vm.zip, county: response.data });
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    phoneLink (phoneNum) {
      return `tel:${phoneNum.replace(' ', '-')}`;
    },
    mapLink (branch) {
      const address = branch.Address.split(' ').join('+').split('-').join('--');
      const city = branch.City.split(' ').join('+');
      const state = branch.State;
      const zip = branch.Zip;

      let googMapLink = `https://www.google.com/maps/search/?api=1&query=${address}+${city}+${state}+${zip}`;

      // Sometimes we need to use a specific Google Maps url
      // to find the right location (see Jay, FL branch)
      if (branch.google_maps_url) {
        googMapLink = branch.google_maps_url;
      }

      return googMapLink;
    },
    hasUrl (branchInfo) {
      if (typeof branchInfo.detail_url === 'string') {
        if (branchInfo.detail_url.length > 0) {
          return true
        }
      }
      if (typeof branchInfo.website === 'string' && !this.config.byAssociation) {
        if (branchInfo.website.length > 0) {
          return true
        }
      }
      return false
    }
  },
  computed: {
    customLogo () {
      if (this.config.customLogo) {
        if (this.config.customLogo.useCustomLogo) {
          return {
            'background-image': `url('${this.config.customLogo.url}')`
          }
        }
      }
    },
    customIntro () {
      if (this.config.customIntro) {
        return this.config.customIntro.useCustomIntro
      }
    },
    disableLogo () {
      if (this.config.disableLogo) {
        return this.config.disableLogo
      }
    },
    disableTitle () {
      if (this.config.disableTitle) {
        return this.config.disableTitle
      }
    },
    countyOverlap () {
      if (this.zip.length >= 5) {
        return this.filteredCounties.length > 1 && this.branches.length > 1
      } else {
        return false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
input[type='number'] {
    -moz-appearance:textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.field-radio,
.field-checkbox {
  input {
    display: none;
  }
  input + label {
    position: relative;
    display: block;
    padding: 0 0 0 23px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 15px;
      height: 15px;
      border: 1px solid #999;
      transition: border-color 0.3s, background-color 0.3s;
    }
  }
  input:checked + label {
    &:before {
      border: 1px solid #5B8F22;
      background-color: #5B8F22;
    }
  }
  input[type="radio"] + label {
    &:before {
      border-radius: 50%;
    }
  }
}
.logo {
  display: block;
  padding: 16px;

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
    background: #5B8F22;
    color: #fff;
    padding: 12px 24px;
    text-transform: uppercase;
    margin: 0;
    font-size: 32px;
  }

  &__intro {
    margin: 0;
    padding: 24px;
    background: #494949;
    color: #fff;
    font-size: 15px;
    line-height: 1.4;

    /deep/ a {
      color: #fff;

      &:hover {
        color: #fff;
        text-decoration: none;
      }
    }
  }

  &__body {
    padding: 16px;
  }

  &__type {
    margin: 0 0 20px;
    padding: 5px 8px 0;
    &:after {
      content: '';
      display: table;
      clear: both;
    }
    h4 {
      margin: 0 0 10px;
      @media only screen and (min-width: 1024px) {
        float: left;
        margin: 0;
      }
    }
    .field-radio {
      float: left;
      margin: 0 20px 0 0;
      @media only screen and (min-width: 1024px) {
        margin: 0 0 0 20px;
      }
    }
  }

  &__search {
    justify-content: space-between;
    align-items: center;
    padding: 0 8px 16px;

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
    width: 75%;
    padding-right: 16px;

    // `/deep/` makes this scoped style available to child components
    // in this case, overriding the 3rd party child component `v-select`
    & /deep/ .v-select {
      &,
      input {
        font-family: 'Georgia', 'Times New Roman', Times, serif;
      }

      input[type="search"],
      input[type="search"]:focus {
        padding-left: 10px;
        padding-right: 10px;
      }

      .open-indicator {
        justify-content: center;
        width: 24px;
        &:before {
          border-width: 1px 1px 0 0;
        }
      }

      .vs__actions {
        flex: 0 0 auto;
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
          margin: 0 8px;
        }
      }

      .selected-tag {
        position: absolute;
        left: 0;
        padding-left: 16px;
      }
    }
  }

  &__zip {
    display: block;
    width: 100%;
    height: 34px;
    padding: 0 20px;
    font-family: 'Georgia', 'Times New Roman', Times, serif;
    font-size: 1em;
    line-height: 1.42857143;
    border-radius: 3px;
    border: 0;
    outline: 0;
    background: #eff1ed;
  }

  &__zip-message {
    font-size: 14px;
    line-height: 20px;
  }

  &__clear {
    flex: 0 0 auto;
    align-self: flex-start;
    margin: 16px 0 0;

    @media only screen and (min-width: 480px) {
      margin: 0 auto;
    }

    @media only screen and (min-width: 768px) {
      margin: 16px 0 0;
    }

    @media only screen and (min-width: 1024px) {
      margin: 3px auto 0;
    }

    .btn-clear {
      appearance: none;
      border: 0;
      background: transparent;
      text-decoration: underline;
      color: #508417;
      font-family: "futura-pt", sans-serif;
      font-size: 16px;
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
  margin: 0 auto 40px;

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
  padding: 16px 0;
  display: flex;
  align-items: center;

  &__position {
    flex: 0 0 3.5rem;
  }

  &__position-number {
    font-size: 32px;
    font-family: 'futura-pt-bold', sans-serif;
    color: #949494;
  }

  &__title {
    color: #508417;
    font-family: 'futura-pt-bold', sans-serif;
    text-transform: uppercase;
    margin: 0;
    font-size: 18px;
  }

  &__info {
    margin-left: 16px;
  }

  p {
    margin: 0;
    line-height: 1.4;

    &.disclaimer {
      margin: 16px auto 0;
      font-size: 12px;
    }
  }
}

// animation
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
