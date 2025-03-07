<template lang="html">
  <div v-click-outside="openDropdown" class="currency-picker-container">
    <div>
      <div
        :class="[
          open ? 'open' : '',
          'dropdown-container',
          token ? 'dropdown-text-container' : 'dropdown-text-container-white'
        ]"
        @click="openDropdown"
      >
        <p v-show="token">
          {{ selectedCurrency.symbol }}
          <span class="subname">- {{ selectedCurrency.name }}</span>
        </p>
        <p v-show="!token">{{ selectedCurrency.name }}</p>
        <i :class="['fa', open ? 'fa-angle-up' : 'fa-angle-down']" />
      </div>
      <div :class="[open ? 'open' : 'hide', 'dropdown-item-container']">
        <div class="dropdown-search-container">
          <input v-model="search" :placeholder="$t('common.search')" />
          <i class="fa fa-search" />
        </div>
        <div class="item-container">
          <div
            v-for="(curr, idx) in localCurrency"
            :class="[
              token
                ? selectedCurrency.symbol === curr.symbol
                  ? 'selected'
                  : ''
                : selectedCurrency.name === curr.name
                ? 'selected'
                : '',
              'item'
            ]"
            :key="
              token
                ? curr.name + idx + curr.symbol + page
                : curr.name + page + idx
            "
            @click="selectCurrency(curr)"
          >
            <p v-show="token">
              {{ curr.symbol }}<span class="subname"> - {{ curr.name }}</span>
            </p>
            <p />
            <p v-show="!token">{{ curr.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    currency: {
      type: Array,
      default: function() {
        return [];
      }
    },
    page: {
      type: String,
      default: ''
    },
    token: {
      type: Boolean,
      default: true
    },
    clearCurrency: {
      type: Boolean,
      default: false
    },
    default: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      selectedCurrency: { name: 'Select an item', abi: '', address: '' },
      open: false,
      search: '',
      abi: '',
      address: ''
    };
  },
  computed: {
    ...mapState(['network']),
    networkToken() {
      return {
        name: this.network.type.name_long,
        symbol: this.network.type.currencyName
      };
    },
    localCurrency() {
      if (this.search !== '') {
        return this.currency.filter(curr => {
          if (curr.name.toLowerCase().includes(this.search.toLowerCase())) {
            return curr;
          }
        });
      }
      if (this.token) {
        return [this.networkToken, ...this.currency];
      }
      return [
        { name: 'Select an item', abi: '', address: '' },
        ...this.currency
      ];
    }
  },
  watch: {
    clearCurrency() {
      this.resetPicker();
    },
    networkToken() {
      if (this.token) this.selectedCurrency = this.networkToken;
    },
    selectedCurrency(newVal) {
      this.$emit('selectedCurrency', newVal);
    },
    default(newVal) {
      if (newVal.hasOwnProperty('symbol')) this.selectedCurrency = newVal;
    }
  },
  mounted() {
    this.resetPicker();
  },
  methods: {
    resetPicker() {
      this.selectedCurrency =
        this.token === true
          ? this.networkToken
          : { name: 'Select an item', abi: '', address: '' };
    },
    openDropdown() {
      this.open = !this.open;
    },
    selectCurrency(currency) {
      this.openDropdown();
      this.selectedCurrency = currency;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CurrencyPicker.scss';
</style>
