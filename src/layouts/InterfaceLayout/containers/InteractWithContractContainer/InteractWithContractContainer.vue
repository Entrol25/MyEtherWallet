<template>
  <div class="interact-with-contract-container">
    <interface-container-title :title="$t('contract.interact')" />
    <div v-if="!interact" class="interact-div">
      <div class="send-form contract-address-container">
        <div class="title-container">
          <div class="title">
            <h4 class="contract-address-title">
              {{ $t('contract.addr') }}
            </h4>
            <div class="select-contract no-border">
              <currency-picker
                :currency="mergedContracts"
                :token="false"
                :clear-currency="clearCurrency"
                page="interactWContract"
                @selectedCurrency="selectedContract"
              />
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <input
            v-validate="'required'"
            v-model="address"
            :placeholder="$t('contract.enter-addr')"
            type="text"
            name="nameAddr"
          />

          <i
            :class="[
              isValidAddress && address !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
            class="address-validation-check"
          />
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('contract.abi-json-int') }}</h4>
            <div class="copy-buttons">
              <span @click="deleteInput('abi')">{{ $t('common.clear') }}</span>
              <span @click="copyToClipboard('abi')">
                {{ $t('common.copy') }}
              </span>
            </div>
          </div>
        </div>
        <div class="the-form domain-name">
          <textarea
            v-validate="'required'"
            ref="abi"
            v-model="abi"
            class="custom-textarea-1"
            name="abiField"
          />
          <i
            :class="[
              isValidAbi && abi !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="submit-button-container">
        <div
          :class="[
            isValidAbi &&
            isValidAddress &&
            !errors.has('nameAddr') &&
            !errors.has('abiField')
              ? ''
              : 'disabled',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click="switchView('forward')"
        >
          {{ $t('common.continue') }}
          <img src="~@/assets/images/icons/right-arrow.png" alt />
        </div>
        <div class="clear-all-btn" @click="resetDefaults()">
          {{ $t('common.clear-all') }}
        </div>
      </div>
    </div>
    <div v-else class="contract-methods-container">
      <h4>{{ $t('contract.read-write') }}</h4>
      <div class="contract-addr-container">
        <div class="contract-addr">
          <p>{{ $t('contract.addr') }}: {{ address }}</p>
        </div>
        <div class="picker-container">
          <currency-picker
            :currency="contractMethods"
            :clear-currency="clearCurrency"
            :token="false"
            page="interactWContract"
            @selectedCurrency="selectedFunction"
          />
        </div>
      </div>
      <div
        v-if="selectedMethod.name !== undefined"
        class="method-arguments-container"
      >
        <h4>{{ selectedMethod.name | capitalize }}</h4>
        <div
          v-for="(input, idx) in selectedMethod.inputs"
          :key="input.name + idx"
          class="input-item-container"
        >
          <div class="title-container">
            <div class="title">
              <h5>{{ input.name | capitalize }} ({{ input.type }}):</h5>
            </div>
          </div>
          <div class="input-container">
            <input
              v-if="getType(input.type).type !== 'radio'"
              :disabled="noInput"
              :type="getType(input.type).type"
              v-model="inputs[input.name]"
              class="non-bool-input"
            />
            <div
              v-if="getType(input.type).type === 'radio'"
              class="bool-input-container"
            >
              <div class="bool-items">
                <input
                  v-model="inputs[input.name]"
                  :value="true"
                  :name="input.name"
                  type="radio"
                />
                <label :for="input.name">{{ $t('contract.true') }}</label>
              </div>
              <div class="bool-items">
                <input
                  v-model="inputs[input.name]"
                  :value="false"
                  :name="input.name"
                  type="radio"
                  checked
                />
                <label :for="input.name">{{ $t('contract.false') }}</label>
              </div>
            </div>
            <i
              v-if="!noInput"
              :class="[
                getType(input.type).type !== 'radio' ? 'non-bool-i' : '',
                isValidInput(
                  inputs[input.name],
                  getType(input.type).solidityType
                )
                  ? ''
                  : 'not-good',
                'fa fa-check-circle good-button'
              ]"
              aria-hidden="true"
            />
          </div>
        </div>
        <div>
          <div class="title-container">
            <div class="title">
              <h4>{{ $t('contract.value-in-eth') }}:</h4>
            </div>
          </div>
          <input
            v-model="value"
            step="any"
            type="text"
            name
            placeholder="ETH"
            class="non-bool-input"
          />
        </div>
        <div v-if="selectedMethod.constant">
          <div class="title-container">
            <div class="title">
              <h4>{{ $t('contract.result') }}:</h4>
            </div>
          </div>
          <div class="result-inputs">
            <input
              v-if="
                resType === 'string' ||
                  resType === 'boolean' ||
                  resType === 'number'
              "
              v-model="result"
              type="text"
              name
              placeholder="0x00000000000000"
              disabled
              class="non-bool-input"
            />
            <div v-if="resType === 'object'">
              <!--
                Have to separate them since v-for still loops when v-if is in the same line getting max stack
              -->
              <div
                v-for="(item, idx) in selectedMethod.outputs"
                :key="item.name + idx"
                class="result-container"
              >
                <label :for="item.name !== '' ? item.name : item.type + idx">
                  {{ item.name !== '' ? item.name : item.type | capitalize }}
                </label>
                <input
                  :name="item.name !== '' ? item.name : item.type + idx"
                  :value="result[idx]"
                  type="text"
                  placeholder="0x00000000000000"
                  disabled
                  class="result-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="interact-buttons">
          <div
            class="submit-button large-round-button-green-border clickable"
            @click="switchView('backwards')"
          >
            {{ $t('common.back') }}
          </div>
          <div
            v-if="
              selectedMethod.hasOwnProperty('inputs') &&
                ((selectedMethod.constant &&
                  selectedMethod.inputs.length > 0) ||
                  !selectedMethod.constant)
            "
            :class="[
              allValid ? '' : 'disabled',
              loading ? 'disabled' : '',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click="write"
          >
            <span v-show="!loading && !selectedMethod.constant">
              {{ $t('contract.write') }}
            </span>
            <span v-show="!loading && selectedMethod.constant">{{
              $t('contract.read')
            }}</span>
            <i v-show="loading" class="fa fa-spinner fa-spin fa-lg" />
          </div>
        </div>
        <div class="clear-all-btn" @click="resetDefaults()">
          {{ $t('common.clear-all') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import { Misc, Toast } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import * as unit from 'ethjs-unit';
import store from 'store';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'currency-picker': CurrencyPicker
  },
  data() {
    return {
      abi: '',
      address: '',
      interact: false,
      contractMethods: [],
      selectedMethod: {},
      result: '',
      loading: false,
      value: 0,
      inputs: {},
      clearCurrency: false
    };
  },
  computed: {
    ...mapState(['network', 'gasPrice', 'account', 'web3']),
    mergedContracts() {
      const customContracts = store.get('customContracts') || [];
      const concatContracts = this.network.type.contracts.concat(
        customContracts
      );
      return concatContracts;
    },
    isValidAbi() {
      return Misc.isJson(this.abi);
    },
    isValidAddress() {
      return isAddress(this.address);
    },
    noInput() {
      return (
        this.selectedMethod.constant && this.selectedMethod.inputs.length === 0
      );
    },
    resType() {
      return typeof this.result;
    },
    allValid() {
      let _allvalid = true;
      if (this.selectedMethod.inputs) {
        this.selectedMethod.inputs.forEach(item => {
          if (
            !this.isValidInput(
              this.inputs[item.name],
              this.getType(item.type).solidityType
            )
          )
            _allvalid = false;
        });
      }
      return _allvalid && this.isValidAbi && this.isValidAddress;
    },
    contractArgs() {
      const _contractArgs = [];
      if (this.selectedMethod) {
        this.selectedMethod.inputs.forEach(item => {
          if (item.type === 'bytes32[]') {
            const parsedItem = this.formatInput(this.inputs[item.name]);
            _contractArgs.push(parsedItem);
          } else if (item.type === 'address') {
            _contractArgs.push(this.inputs[item.name].toLowerCase().trim());
          } else {
            _contractArgs.push(this.inputs[item.name]);
          }
        });
      }
      return _contractArgs;
    },
    txValue() {
      return Misc.sanitizeHex(unit.toWei(this.value, 'ether').toString(16));
    }
  },
  watch: {
    network() {
      this.abi = '';
      this.address = '';
      this.interact = false;
      this.contractMethods = [];
      this.selectedMethod = {};
      this.result = '';
    }
  },
  methods: {
    resetDefaults() {
      this.abi = '';
      this.address = '';
      this.interact = false;
      this.contractMethods = [];
      this.selectedMethod = {};
      this.result = '';
      this.loading = false;
      this.value = 0;
      this.inputs = {};
      this.clearCurrency = !this.clearCurrency;
    },
    isValidInput: Misc.isContractArgValid,
    getType: Misc.solidityType,
    selectedContract(selected) {
      if (selected.abi === '') {
        this.abi = '';
      } else {
        this.abi = JSON.stringify(selected.abi);
      }
      this.address = selected.address;
    },
    selectedFunction(method) {
      if (!method.hasOwnProperty('constant')) return;
      const contract = new this.web3.eth.Contract(
        [method],
        this.address.toLowerCase()
      );
      if (method.constant === true && method.inputs.length === 0) {
        contract.methods[method.name]()
          .call({ from: this.account.address.toLowerCase() })
          .then(res => {
            this.result = res;
          })
          .catch(e => {
            this.loading = false;
            Toast.responseHandler(e, Toast.WARN);
          });
      } else {
        this.result = '';
      }
      this.loading = false;
      this.selectedMethod = method;
      this.selectedMethod.inputs.forEach(input => {
        if (input.type === 'bool') {
          this.inputs[input.name] = false;
        }
      });
    },
    formatInput(str) {
      if (str[0] === '[') {
        return str;
      }
      const newArr = str.split(',');
      return newArr.map(function(item) {
        return item.replace(' ', '');
      });
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInput(ref) {
      this.$refs[ref].value = '';
    },
    switchView(direction) {
      switch (direction) {
        case 'forward':
          if (this.abi !== '') {
            JSON.parse(this.abi).forEach(item => {
              if (item.type !== 'constructor' && item.constant !== undefined) {
                this.contractMethods.push(item);
              }
            });
          }
          this.interact = true;
          this.loading = false;
          break;
        default:
          this.resetDefaults();
      }
    },
    async write() {
      const web3 = this.web3;
      const contract = new web3.eth.Contract(
        [this.selectedMethod],
        this.address.toLowerCase()
      );
      this.loading = true;
      if (this.selectedMethod.constant === true) {
        contract.methods[this.selectedMethod.name](...this.contractArgs)
          .call({ from: this.account.address.toLowerCase() })
          .then(res => {
            this.result = res;
            this.loading = false;
          })
          .catch(e => {
            this.loading = false;
            Toast.responseHandler(e, false);
          });
      } else {
        const nonce = await web3.eth.getTransactionCount(
          this.account.address.toLowerCase()
        );
        let errored = false;
        const gasLimit = await contract.methods[this.selectedMethod.name](
          ...this.contractArgs
        )
          .estimateGas({
            from: this.account.address.toLowerCase(),
            value: this.txValue
          })
          .then(res => {
            return res;
          })
          .catch(e => {
            this.loading = false;
            Toast.responseHandler(e, Toast.ERROR);
            errored = true;
          });
        if (!errored) {
          const data = contract.methods[this.selectedMethod.name](
            ...this.contractArgs
          ).encodeABI();

          const raw = {
            from: this.account.address.toLowerCase(),
            gas: gasLimit,
            nonce: nonce,
            gasPrice: Number(unit.toWei(this.gasPrice, 'gwei')),
            value: this.txValue,
            to: this.address.toLowerCase(),
            data: data
          };
          this.loading = false;
          web3.eth.sendTransaction(raw).catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InteractWithContractContainer.scss';
</style>
