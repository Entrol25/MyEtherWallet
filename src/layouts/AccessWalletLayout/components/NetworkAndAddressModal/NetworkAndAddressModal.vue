<template>
  <b-modal
    ref="networkAndAddress"
    :title="$t('accessWallet.network-addr.string')"
    hide-footer
    class="bootstrap-modal nopadding modal-network-and-address"
    centered
    static
    lazy
  >
    <div class="modal-content-container">
      <div class="collapse-container">
        <b-btn
          v-b-toggle.collapse1
          class="collapse-open-button"
          variant="primary"
        >
          <p class="button-number">1</p>
          <div class="network">
            <p>{{ $t('common.network') }}</p>
            <p class="network-name monospace">
              ({{ selectedNetwork.type.name }} - {{ selectedNetwork.service }})
            </p>
          </div>
          <p v-if="false" class="right-button">{{ $t('common.cancel') }}</p>
        </b-btn>
        <b-collapse
          id="collapse1"
          class="collapse-content"
          accordion="networkaddraccordion"
        >
          <ul class="networks">
            <li
              v-for="(key, index) in Object.keys(reorderNetworkList)"
              :key="$router.path + key + index"
            >
              <div class="network-title">
                <div class="network-icon-container">
                  <img
                    v-if="Networks[key][0].type.icon"
                    :src="Networks[key][0].type.icon"
                    alt
                  />
                  <div v-else class="no-icon">
                    <p>{{ $t('common.no-icon') }}</p>
                  </div>
                </div>
                <p>{{ key }}</p>
              </div>
              <div class="network-content">
                <p
                  v-for="net in Networks[key]"
                  :key="net.service"
                  :class="
                    net.service === selectedNetwork.service &&
                    net.type &&
                    net.type.name === selectedNetwork.type.name
                      ? 'current-network'
                      : ''
                  "
                  @click="switchNetwork(net)"
                >
                  {{ net.service }}
                </p>
              </div>
            </li>
          </ul>
        </b-collapse>
      </div>
      <div class="collapse-container">
        <b-btn
          v-b-toggle.collapse2
          class="collapse-open-button"
          variant="primary"
        >
          <p class="button-number">2</p>
          <p>{{ $t('common.addr') }}</p>
        </b-btn>
        <b-collapse
          id="collapse2"
          accordion="networkaddraccordion"
          visible
          class="collapse-content"
        >
          <!-- Derivation Path Drop down -->
          <div
            v-show="hardwareWallet.identifier !== ledgerType"
            class="content-container-1"
          >
            <div class="hd-derivation">
              <h4>{{ $t('accessWallet.path.hd-derivation') }}</h4>
              <div class="dropdown-button-container">
                <b-dropdown
                  id="hd-derivation-path"
                  :text="`${getPathLabel(selectedPath)} (${selectedPath}`"
                  right
                  class="dropdown-button-2"
                >
                  <b-dropdown-item
                    v-for="(val, key) in availablePaths"
                    :class="[
                      selectedPath === val.path ? 'active' : '',
                      'dropdown-paths'
                    ]"
                    :key="'base' + key"
                    @click="changePath(key)"
                  >
                    {{ val.label }}
                    <span>({{ val.path }})</span>
                  </b-dropdown-item>
                  <b-dropdown-divider />
                  <b-dropdown-item>{{
                    $t('accessWallet.path.custom')
                  }}</b-dropdown-item>
                  <b-dropdown-item
                    v-for="(val, key) in customPaths"
                    :class="selectedPath === val.path ? 'active' : ''"
                    :key="key"
                  >
                    <div class="custom-networks">
                      <div @click="changePath(key)">
                        {{ val.label }} <span>({{ val.path }})</span>
                      </div>
                      <span>
                        <i
                          class="fa fa-times-circle"
                          @click.prevent="removeCustomPath(val)"
                        />
                      </span>
                    </div>
                  </b-dropdown-item>
                  <b-dropdown-item @click="showCustomPathInput">{{
                    $t('accessWallet.path.add-custom')
                  }}</b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
            <p
              v-show="invalidPath !== '' && customPathInput"
              class="error-message-container"
            >
              {{
                $t('accessWallet.path.invalid-desc', { path: invalidPath.path })
              }}
            </p>
            <p v-show="!customPathInput" class="derivation-brands monospace">
              {{ getPathLabel(selectedPath) }} ({{ selectedPath }})
            </p>
            <div v-show="customPathInput" class="custom-path-container">
              <label for="customPathLabel">{{
                $t('accessWallet.path.alias')
              }}</label>
              <input
                id="customPathLabel"
                v-model="customPath.label"
                placeholder="my custom path"
              />
              <label for="customPathInput">{{
                $t('accessWallet.path.string')
              }}</label>
              <input
                id="customPathInput"
                v-model="customPath.path"
                placeholder="m/44'/1'/0'/0"
              />
              <button class="submit-button cancel" @click="showCustomPathInput">
                {{ $t('common.cancel') }}
              </button>
              <button class="submit-button submit" @click="addCustomPath">
                {{ $t('accessWallet.path.add-custom') }}
              </button>
            </div>
          </div>
          <!-- Address List -->
          <div class="content-container-2">
            <div class="address-block-container">
              <div class="block-title">
                <h4>{{ $t('accessWallet.network-addr.addr-to-interact') }}</h4>
              </div>

              <ul class="address-block table-header fours">
                <li>{{ $t('accessWallet.network-addr.id') }}</li>
                <li>{{ $t('common.addr') }}</li>
                <li>{{ $t('common.balance.string') }}</li>
              </ul>

              <ul
                v-for="account in HDAccounts"
                :data-address="'address' + account.index"
                :key="account.index"
                :class="[
                  selectedId === 'address' + account.index ? 'selected' : '',
                  'address-block address-data fours'
                ]"
                @click="setAccount(account)"
              >
                <li>
                  <blockie
                    :address="account.account.getChecksumAddressString()"
                    :size="8"
                    :scale="16"
                    width="30px"
                    height="30px"
                  />
                </li>
                <li class="monospace">
                  {{ account.account.getChecksumAddressString() | concatAddr }}
                </li>
                <li class="monospace">{{ convertBalance(account.balance) }}</li>
                <li class="user-input-checkbox">
                  <label class="checkbox-container checkbox-container-small">
                    <input
                      :id="'address' + account.index"
                      type="checkbox"
                      @click="unselectAllAddresses"
                    />
                    <span class="checkmark checkmark-small" />
                  </label>
                </li>
              </ul>
            </div>
            <!-- .address-block-container -->
            <div class="address-nav">
              <span @click="previousAddressSet()"
                >&lt; {{ $t('common.previous') }}</span
              >
              <span @click="nextAddressSet()"
                >{{ $t('common.next') }} &gt;</span
              >
            </div>
          </div>
          <!-- .content-container-2 -->
        </b-collapse>
        <div class="accept-terms">
          <label class="checkbox-container">
            <i18n path="accessWallet.accept-terms">
              <router-link slot="terms" to="/terms-of-service"
                >{{ $t('common.terms') }}.</router-link
              >
            </i18n>
            <input v-model="acceptTerms" type="checkbox" />
            <span class="checkmark" />
          </label>
        </div>
        <div class="button-container">
          <b-btn
            :disabled="!isDisabled"
            class="mid-round-button-green-filled close-button"
            @click.prevent="unlockWallet"
            >{{ $t('common.wallet.access-my') }}</b-btn
          >
        </div>
        <customer-support />
      </div>
    </div>
    <!-- .modal-content-container -->
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { mapState } from 'vuex';
import { Misc, Toast, pathHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import Blockie from '@/components/Blockie';
import { LEDGER as LEDGER_TYPE } from '@/wallets/bip44/walletTypes';

const MAX_ADDRESSES = 5;
export default {
  components: {
    'customer-support': CustomerSupport,
    blockie: Blockie
  },
  props: {
    hardwareWallet: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      selectedId: '',
      currentIndex: 0,
      HDAccounts: [],
      availablePaths: {},
      selectedPath: '',
      invalidPath: '',
      customPathInput: false,
      currentWallet: null,
      customPath: { label: '', dpath: '' },
      showCollapse: false,
      ledgerType: LEDGER_TYPE,
      acceptTerms: false
    };
  },
  computed: {
    ...mapState([
      'network',
      'Networks',
      'customPaths',
      'path',
      'web3',
      'wallet'
    ]),
    selectedNetwork() {
      return this.network;
    },
    reorderNetworkList() {
      return Misc.reorderNetworks();
    },
    isDisabled() {
      return this.selectedId !== '' && this.acceptTerms;
    }
  },
  watch: {
    hardwareWallet() {
      this.getPaths();
      this.setHDAccounts();
    }
  },
  mounted() {
    // reset component values when modal becomes hidden
    this.$refs.networkAndAddress.$on('hidden', () => {
      this.availablePaths = {};
      this.selectedPath = '';
      this.invalidPath = '';
      this.customPathInput = false;
      this.currentWallet = null;
      this.customPath = { label: '', path: '' };
      this.resetPaginationValues();
    });
  },
  methods: {
    switchNetwork(network) {
      this.$store.dispatch('switchNetwork', network).then(() => {
        this.$store.dispatch('setWeb3Instance');
        this.currentIndex = 0;
        this.setHDAccounts();
      });
    },
    unselectAllAddresses: function(selected) {
      document
        .querySelectorAll('.user-input-checkbox input')
        .forEach(function(el) {
          el.checked = el.id === selected;
        });
    },
    setAccount(account) {
      this.selectedId = 'address' + account.index;
      this.unselectAllAddresses('address' + account.index);
      this.currentWallet = account.account;
    },
    resetPaginationValues() {
      this.currentIndex = 0;
    },
    showCustomPathInput() {
      this.customPath = { label: '', path: '' };
      this.customPathInput = !this.customPathInput;
    },
    convertBalance(bal) {
      if (bal === 'loading') return bal;
      return new BigNumber(web3utils.fromWei(bal, 'ether')).toFixed(3);
    },
    removeCustomPath(path) {
      this.$store.dispatch('removeCustomPath', path).then(() => {
        this.getPaths();
      });
    },
    addCustomPath() {
      const customPath = pathHelpers.checkCustomPath(this.customPath.path);
      if (customPath) {
        this.customPath.path = customPath;
        this.$store
          .dispatch('addCustomPath', {
            label: this.customPath.label,
            path: customPath
          })
          .then(() => {
            this.getPaths();
          });
        this.showCustomPathInput(); // reset the path input
      } else {
        this.invalidPath = this.customPath;
      }
    },
    changePath(key) {
      this.resetPaginationValues();
      let selectedPath;
      if (this.availablePaths[key]) {
        selectedPath = this.availablePaths[key].path;
      } else if (this.customPaths[key]) {
        selectedPath = this.customPaths[key].path;
      } else {
        selectedPath = this.selectedPath;
      }

      this.hardwareWallet
        .init(selectedPath)
        .then(() => {
          this.getPaths();
          this.currentIndex = 0;
          this.setHDAccounts();
          this.$refs.networkAndAddress.show();
        })
        .catch(error => {
          // if HD path is not supported by the hardware
          this.HDAccounts = [];
          Toast.responseHandler(error, Toast.ERROR);
        });
      this.selectedPath = this.hardwareWallet.getCurrentPath();
    },
    setBalances: web3utils._.debounce(function() {
      this.HDAccounts.forEach(account => {
        if (account.account) {
          this.web3.eth
            .getBalance(account.account.getAddressString())
            .then(balance => {
              account.balance = balance;
            })
            .catch(e => {
              Toast.responseHandler(e, Toast.ERROR);
            });
        } else {
          account.balance = 0;
        }
      });
    }, 1000),
    unlockWallet() {
      this.$store
        .dispatch('decryptWallet', [this.currentWallet])
        .then(() => {
          if (this.wallet !== null) {
            if (!this.$route.path.split('/').includes('interface')) {
              this.$router.push({
                path: 'interface'
              });
            }
          }

          this.$refs.networkAndAddress.hide();
        })
        .catch(error => {
          // the wallet param (param[0]) is undefined or null
          Toast.responseHandler(error, Toast.ERROR);
        });
    },
    async setHDAccounts() {
      if (!this.web3.eth) this.$store.dispatch('setWeb3Instance');
      this.HDAccounts = [];
      for (
        let i = this.currentIndex;
        i < this.currentIndex + MAX_ADDRESSES;
        i++
      ) {
        const account = await this.hardwareWallet.getAccount(i);
        this.HDAccounts.push({
          index: i,
          account: account,
          balance: 'loading'
        });
        this.setBalances();
      }
      this.currentIndex += MAX_ADDRESSES;
    },
    nextAddressSet() {
      this.setHDAccounts();
    },
    previousAddressSet() {
      this.currentIndex =
        this.currentIndex - 2 * MAX_ADDRESSES < 0
          ? 0
          : this.currentIndex - 2 * MAX_ADDRESSES;
      this.setHDAccounts();
    },
    getPathLabel(path) {
      for (const _p in this.customPaths) {
        if (this.customPaths[_p].path === path) {
          return this.customPaths[_p].label;
        }
      }

      for (const _p in this.availablePaths) {
        if (this.availablePaths[_p].path === path) {
          return this.availablePaths[_p].label;
        }
      }

      return 'Unknown';
    },
    getPaths() {
      this.selectedPath = this.hardwareWallet.getCurrentPath();
      this.availablePaths = this.hardwareWallet.getSupportedPaths();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NetworkAndAddressModal-desktop.scss';
@import 'NetworkAndAddressModal-tablet.scss';
@import 'NetworkAndAddressModal-mobile.scss';

.activeConn {
  color: gray;
}
</style>

<style lang="scss">
.dropdown-paths {
  .dropdown-item {
    align-items: center;
    display: flex !important;
    justify-content: space-between;
  }
}
</style>
