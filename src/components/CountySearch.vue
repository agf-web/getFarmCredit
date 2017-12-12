<template>
  <div id="CountySearch">
    <div class="CountySearch__head">

      <label>Search by County</label><br>
      <vue-instant 
        :suggestion-attribute="suggestionAttribute"
        v-model="searchTerm"
        :disabled="false"
        @input="changed" 
        @click-input="clickInput" 
        @click-button="clickButton" 
        @selected="selected"
        @enter="enter" 
        @key-up="keyUp" 
        @key-down="keyDown" 
        @key-right="keyRight" 
        @clear="clear"
        @escape="escape" 
        :show-autocomplete="true" 
        :autofocus="false" 
        :suggestions="counties" 
        name="customName" 
        placeholder="custom placeholder" 
        type="google"
      ></vue-instant><br><br>

      <br>

      <label>Searching for: <strong>{{searchTerm}}</strong></label>
      <hr>
    </div>

    <div class="CountySearch__branchList">
      <ul>
        <li v-for="(item,index) in branches" v-bind:key="index">
          <h4>#{{index + 1}} {{ item.Branch }}</h4>
          <p>
            {{ item.Address}}<br>
            {{ item.City }}, {{item.State}} {{ item.Zip }}
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
/* eslint-disable */
import Vue from 'vue';
import 'vue-instant/dist/vue-instant.css';
import VueInstant from 'vue-instant/dist/vue-instant.common';

Vue.use(VueInstant);

export default {
  name: 'ag-county-search',
  props: ['branches'],
  data() {
    return {
      searchTerm: '',
      suggestions: [],
      suggestionAttribute: 'countyName'
    };
  },
  computed: {
    counties() {
      let allCounties = this.branches.map((branch) => {
        return branch.County.split(',').map(item => item.trim()).filter(term => term !== '');
      });

      return _.union(...allCounties).sort()
        .map((county) => { return { countyName: county }; });
    }
  },
  methods: {
    clickInput() {
      this.selectedEvent = 'click input';
    },
    clickButton() {
      this.selectedEvent = 'click button';
    },
    selected() {
      this.selectedEvent = 'selection changed';
    },
    enter() {
      this.selectedEvent = 'enter';
    },
    keyUp() {
      this.selectedEvent = 'keyup pressed';
    },
    keyDown() {
      this.selectedEvent = 'keyDown pressed';
    },
    keyRight() {
      this.selectedEvent = 'keyRight pressed';
    },
    clear() {
      this.selectedEvent = 'clear input';
    },
    escape() {
      this.selectedEvent = 'escape';
    },
    changed(event) {
      this.$emit('searchedCounty', event);
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
</style>
