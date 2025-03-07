<template>
  <div class="settings-modal">
    <div class="modal-container">
      <b-modal
        ref="settings"
        :title="$t('interface.settings')"
        hide-footer
        centered
        class="bootstrap-modal nopadding"
        static
        lazy
      >
        <div class="modal-contents">
          <full-width-dropdown
            ref="gasDropdown"
            :title="$t('interface.config.tx-speed')"
            class="tx-speed"
          >
            <div class="radio-buttons">
              <ul>
                <li
                  v-for="(val, key) in gasPriceInputs"
                  :key="key"
                  :class="selectedGasType === key ? 'selected' : ''"
                >
                  <div>
                    <input
                      :id="key"
                      :value="key"
                      :checked="selectedGasType === key"
                      name="speedRadioInputs"
                      type="radio"
                      @change="selectGasType(key)"
                    />
                    <label :for="key">
                      {{ key | capitalize }} ({{ gasPriceInputs[key].gwei }}
                      {{ $t('common.gas.gwei') }})
                    </label>
                  </div>
                  <p class="hidden">
                    {{ gasPriceInputs[key].eth }} {{ network.type.name }}
                    <span v-if="ethPrice !== 0 && network.type.name === 'ETH'">
                      ($
                      {{ convert(gasPriceInputs[key].eth) }})
                    </span>
                  </p>
                </li>
                <li :class="selectedGasType === 'other' ? 'selected' : ''">
                  <div>
                    <input
                      id="ccc"
                      :checked="selectedGasType === 'other'"
                      type="radio"
                      name="speedRadioInputs"
                      value="other"
                      @change="selectGasType('other')"
                    />
                    <input
                      ref="customInput"
                      v-model="customGas"
                      type="number"
                      @focus="selectedGasType = 'other'"
                    />
                    <p class="gwei">{{ $t('common.gas.gwei') }}</p>
                  </div>
                  <p class="hidden">
                    {{ customGasEth }}
                    {{ network.type.currencyName }}
                    <span
                      v-if="
                        ethPrice !== 0 &&
                          customGasEth !== 0 &&
                          network.type.name === 'ETH'
                      "
                      >($ {{ convert(customGasEth) }})</span
                    >
                  </p>
                </li>
              </ul>
            </div>
            <div class="button-block">
              <standard-button
                :options="buttonSave"
                :button-disabled="selectedGasType === 'other' && customGas < 1"
                @click.native="saveGasChanges"
              />
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            :title="$t('interface.config.import')"
            class="import-config"
          >
            <b-alert :show="popup" fade variant="info">{{
              $t('interface.config.import-success')
            }}</b-alert>
            <p>
              {{ $t('interface.config.import-desc') }}
            </p>
            <div class="import-button-block">
              <div class="filename">
                {{ inputFileName }}
              </div>
              <input
                ref="uploadInput"
                type="file"
                name="file"
                @change="receiveUploadedFile"
              />
              <standard-button
                :options="buttonUploadFile"
                @click.native="uploadFile"
              />
            </div>
            <div class="button-block">
              <standard-button
                :options="buttonImport"
                :button-disabled="importedFile === ''"
                @click.native="setDataFromImportedFile"
              />
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            :title="$t('interface.config.export')"
            class="export-config"
          >
            <p>
              {{ $t('interface.config.export-desc') }}
            </p>
            <div class="button-block">
              <a
                :href="file"
                :download="fileName"
                rel="noopener noreferrer"
                class="export-button"
              >
                <standard-button :options="buttonExport" />
              </a>
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            :title="$t('interface.address-book.title')"
            class="address-book"
          >
            <p>
              {{ $t('interface.address-book.add-up-to') }}
            </p>
            <div class="table-container">
              <table v-if="addressBook.length > 0" class="contact-container">
                <colgroup>
                  <col width="5%" />
                  <col width="55%" />
                  <col width="20%" />
                  <col width="20%" />
                </colgroup>
                <thead>
                  <tr class="header">
                    <th>#</th>
                    <th>{{ $t('common.addr') }}</th>
                    <th>{{ $t('interface.address-book.nickname') }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(contact, index) in addressBook"
                    :key="contact.key"
                  >
                    <td class="numbered">{{ index + 1 }}.</td>
                    <td class="addr-container">
                      <blockie
                        :address="contact.address"
                        width="25px"
                        height="25px"
                        class="blockie-image"
                      />
                      <a
                        :href="
                          'https://etherscan.io/address/' + contact.address
                        "
                        rel="noopener noreferrer"
                        class="contact-addr"
                        target="_blank"
                        >{{ contact.address }}</a
                      >
                    </td>
                    <td>
                      {{ contact.nickname }}
                    </td>
                    <td>
                      <span class="remove-txt" @click="removeContact(index)">
                        {{ $t('interface.address-book.remove') }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <span v-if="addrBookErrMsg" class="err">{{ addrBookErrMsg }}</span>

            <div class="address-inputs">
              <blockie
                v-show="isValidAddress"
                :address="contactAddress"
                width="32px"
                height="32px"
                class="blockie-image"
              />
              <input
                v-addr-resolver="'contactAddress'"
                :class="isValidAddress ? 'blockie-input' : ''"
                v-model="contactAddress"
                :placeholder="$t('common.addr')"
                type="text"
              />
            </div>
            <div class="addr-btn-container">
              <input
                v-model="contactNickname"
                :placeholder="$t('interface.address-book.nickname')"
                class="nickname-input"
                type="text"
              />
              <standard-button
                :options="buttonAddress"
                :button-disabled="
                  !contactAddress || !isValidAddress || addrBookErrMsg !== null
                "
                @click.native="addContact"
              />
            </div>
          </full-width-dropdown>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import FullWidthDropdownMenu from '@/components/FullWidthDropdownMenu';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import store from 'store';
import { Toast } from '@/helpers';
import { mapState } from 'vuex';
import Blockie from '@/components/Blockie';

export default {
  name: 'Settings',
  components: {
    'full-width-dropdown': FullWidthDropdownMenu,
    blockie: Blockie
  },
  props: {
    gasPrice: {
      type: String,
      default: '0'
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      buttonSave: {
        title: 'Save',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        mobileFullWidth: true
      },
      buttonExport: {
        title: 'Export',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        mobileFullWidth: true
      },
      buttonUploadFile: {
        title: 'Upload File...',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      },
      buttonImport: {
        title: 'Import',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: false
      },
      buttonAddress: {
        title: 'Add Contact',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: false
      },
      inputFileName: '',
      selectedGasType: 'regular',
      customGas: 0,
      customGasEth: 0,
      ethPrice: 0,
      fileName: '',
      file: '',
      importedFile: '',
      popup: false,
      isValidAddress: false,
      contactAddress: '',
      contactNickname: '',
      addrBookErrMsg: null
    };
  },
  computed: {
    ...mapState(['network', 'online', 'addressBook']),
    gasPriceInputs() {
      return {
        economy: {
          gwei: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(1).toFixed(0),
              'gwei'
            )
          ).toFixed(),
          eth: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(1).toFixed(0),
              'ether'
            )
          ).toFixed()
        },
        regular: {
          gwei: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).times(1.5).toFixed(0),
              'gwei'
            )
          ).toFixed(),
          eth: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).times(1.5).toFixed(0),
              'ether'
            )
          ).toFixed()
        },
        fast: {
          gwei: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).times(2).toFixed(0),
              'gwei'
            )
          ).toFixed(),
          eth: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(2).toFixed(0),
              'ether'
            )
          ).toFixed()
        }
      };
    }
  },
  watch: {
    customGas(newVal) {
      if (newVal !== '') {
        if (new BigNumber(newVal).gte(1)) {
          const toGwei = new BigNumber(
            utils.toWei(`${newVal}`, 'gwei')
          ).toFixed();
          this.customGasEth = new BigNumber(
            `${utils.fromWei(toGwei, 'ether')}`
          ).toFixed();
        } else {
          this.customGas = 1;
        }
      }
    },
    gasPrice() {
      this.saveGasChanges();
    }
  },
  mounted() {
    if (this.online) {
      this.getEthPrice();
    }
    this.exportConfig();
    this.getGasType();
  },
  methods: {
    setDataFromImportedFile() {
      const reader = new FileReader();
      const notifObj = {};
      notifObj[this.address] = [];
      reader.onloadend = evt => {
        try {
          const notifications = store.get('notifications') || notifObj;
          const file = JSON.parse(evt.target.result);
          const fNotifications = file.notifications || [];
          fNotifications.forEach(objAddr => {
            const addr = Object.keys(objAddr)[0];
            notifications[addr] = objAddr[addr];
          });
          store.set('notifications', notifications);
          store.set('skipTutorial', file.main.skipTutorial);
          store.set('customTokens', file.main.customTokens);
          store.set('customNetworks', file.main.customNetworks);
          store.set('customDeriviationPaths', file.main.customDeriviationPaths);
          store.set('gas', file.main.gas);

          this.popup = true;

          setTimeout(() => {
            this.popup = false;
          }, 1500);
        } catch (e) {
          Toast.responseHandler(
            new Error(this.$t('interface.import-error')),
            Toast.ERROR
          );
        }
      };
      reader.readAsBinaryString(this.importedFile);
    },
    receiveUploadedFile(e) {
      const pathParts = e.target.value.split('\\');
      this.inputFileName = pathParts[pathParts.length - 1];

      this.importedFile = e.target.files[0];
    },
    getGasType() {
      const type = store.get('gasPriceType');
      const amt = store.get('gasPrice');
      if (type) {
        this.selectedGasType = type;
      }

      if (amt) {
        if (this.gasPriceInputs[type] !== undefined) {
          this.$store.dispatch(
            'setGasPrice',
            new BigNumber(this.gasPriceInputs[type].gwei).toNumber()
          );
        } else {
          this.customGas = amt;
          this.$store.dispatch('setGasPrice', new BigNumber(amt).toNumber());
        }
      }
    },
    uploadFile() {
      const uploadInput = this.$refs.uploadInput;
      uploadInput.value = '';
      uploadInput.click();
    },
    saveGasChanges() {
      if (this.gasPriceInputs[this.selectedGasType] !== undefined) {
        this.$store.dispatch(
          'setGasPrice',
          new BigNumber(
            this.gasPriceInputs[this.selectedGasType].gwei
          ).toNumber()
        );
      } else {
        this.$store.dispatch(
          'setGasPrice',
          new BigNumber(this.customGas).toNumber()
        );
      }
      if (this.$refs.gasDropdown) {
        this.$refs.gasDropdown.dropdownOpen = false;
      }
    },
    selectGasType(type) {
      store.set('gasPriceType', type);
      this.selectedGasType = type;
      if (type === 'other') {
        this.$refs.customInput.focus();
      }
    },
    exportConfig() {
      const time = new Date().toISOString();
      const notifications = [];
      const storedNotifs = store.get('notifications') || {};
      Object.keys(storedNotifs).forEach(item => {
        if (storedNotifs[item].length > 0) {
          const obj = {};
          obj[item] = storedNotifs[item];
          notifications.push(obj);
        }
      });
      const gas = {};
      if (this.gasPriceInputs[this.selectedGasType] !== undefined) {
        gas['speed'] = this.selectedGasType;
      } else {
        gas['price'] = this.customGas;
      }

      const exportableObject = {
        timestamp: time,
        main: {
          customNetworks:
            store.get('customNetworks') !== undefined
              ? store.get('customNetworks')
              : [],
          customTokens:
            store.get('customTokens') !== undefined
              ? store.get('customTokens')
              : {},
          customDeriviationPaths:
            store.get('customDeriviationPaths') !== undefined
              ? store.get('customDeriviationPaths')
              : [],
          gas: gas,
          skipTutorial: true
        },
        notifications: notifications
      };

      this.fileName = `mew-export-${time}.json`;

      const file = new Blob([JSON.stringify(exportableObject)], {
        type: 'application/json'
      });
      this.file = window.URL.createObjectURL(file);
    },
    convert(price) {
      const convertedPrice = new BigNumber(price * this.ethPrice).toFixed();
      return this.$options.filters.concatAddr(convertedPrice);
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });

      this.ethPrice = price.data.ETH.quotes.USD.price;
    },
    removeContact(idx) {
      this.addressBook.splice(idx, 1);
      this.$store.dispatch('setAddressBook', this.addressBook);
      this.addrBookErrMsg = null;
    },
    addContact() {
      const alreadyExists = Object.keys(this.addressBook).some(key => {
        return this.addressBook[key].address === this.contactAddress;
      });

      if (this.addressBook.length > 9) {
        this.addrBookErrMsg = this.$t('interface.address-book.add-up-to');
        this.contactAddress = '';
        this.contactNickname = '';
        return;
      } else if (alreadyExists) {
        Toast.responseHandler(
          new Error(this.$t('interface.address-book.already-exists')),
          Toast.ERROR
        );
        this.contactAddress = '';
        this.contactNickname = '';
        return;
      }

      this.addrBookErrMsg = null;

      this.addressBook.push({
        address: this.contactAddress,
        currency: 'ETH',
        nickname: this.contactNickname || this.addressBook.length + 1
      });

      this.$store.dispatch('setAddressBook', this.addressBook);

      this.contactAddress = '';
      this.contactNickname = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SettingsModal.scss';
</style>
