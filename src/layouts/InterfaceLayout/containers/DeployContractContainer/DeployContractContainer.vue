<template>
  <div class="deploy-contract-container">
    <interface-container-title :title="$t('contract.deploy')" />
    <div class="content-container">
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('contract.byte-code') }}</h4>
            <div class="copy-buttons">
              <button class="title-button" @click="deleteInput('bytecode')">
                {{ $t('common.clear') }}
              </button>
              <button class="title-button" @click="copyToClipboard('bytecode')">
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form byte-code">
          <textarea
            ref="bytecode"
            v-model="bytecode"
            class="custom-textarea-1"
          />
          <i
            :class="[
              isValidByte ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('contract.abi-json-int') }}</h4>
            <div class="copy-buttons">
              <button class="title-button" @click="deleteInput('abi')">
                {{ $t('common.clear') }}
              </button>
              <button class="title-button" @click="copyToClipboard('abi')">
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form">
          <textarea ref="abi" v-model="abi" class="custom-textarea-1" />
          <i
            :class="[
              isValidAbi && abi !== '' ? '' : 'not-good',
              'fa fa-check-circle good-button'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div v-if="abiConstructor" class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>
              {{ $t('contract.constructor') }}
              {{ abiConstructor ? 'Inputs' : 'Input' }}:
            </h4>
          </div>
        </div>
        <div
          v-for="(input, idx) in abiConstructor.inputs"
          :key="input.name + idx"
        >
          <div class="title-container">
            <div class="title">
              <h5>{{ input.name | capitalize }} ({{ input.type }}):</h5>
            </div>
          </div>
          <div class="the-form contract-name">
            <input
              v-if="getType(input.type).type !== 'radio'"
              :type="getType(input.type).type"
              v-model="inputs[input.name]"
            />
            <div
              v-if="getType(input.type).type === 'radio'"
              class="bool-input-container"
            >
              <div>
                <input
                  v-model="inputs[input.name]"
                  :value="true"
                  :name="input.name"
                  type="radio"
                />
                <label :for="input.name">{{ $t('contract.true') }}</label>
              </div>
              <div>
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
              :class="[
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
      </div>

      <div
        v-if="abiConstructor !== null && abiConstructor.payable"
        class="send-form"
      >
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('contract.value-in-eth') }}:</h4>
          </div>
        </div>
        <div class="the-form contract-name">
          <input
            ref="value"
            v-model="value"
            :placeholder="$t('contract.value-in-eth')"
            step="any"
          />
        </div>
      </div>
      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <h4>{{ $t('contract.name') }}</h4>
          </div>
        </div>
        <div class="the-form contract-name">
          <input
            ref="contractName"
            v-model="contractName"
            :placeholder="$t('contract.name-for-contract')"
          />
        </div>
      </div>

      <div class="submit-button-container">
        <div class="buttons">
          <div
            :class="[
              allValid ? '' : 'disabled',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click="confirmationModalOpen"
          >
            {{ $t('contract.sign-tx') }}
          </div>
        </div>
        <div class="clear-all-btn" @click="clear()">
          {{ $t('common.clear-all') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import { Misc, Toast } from '@/helpers';
import ethUnit from 'ethjs-unit';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';
import store from 'store';
import { generateAddress, bufferToHex } from 'ethereumjs-util';
import { mapState } from 'vuex';

export default {
  name: 'DeployContract',
  components: {
    'interface-container-title': InterfaceContainerTitle
  },
  data() {
    return {
      bytecode: '',
      abi: '',
      inputs: {},
      contractName: '',
      gasLimit: 21000,
      data: '',
      value: 0
    };
  },
  computed: {
    ...mapState(['gasPrice', 'web3', 'network']),
    isValidAbi() {
      return Misc.isJson(this.abi) && Array.isArray(JSON.parse(this.abi));
    },
    txValue() {
      return Misc.sanitizeHex(ethUnit.toWei(this.value, 'ether').toString(16));
    },
    abiConstructor() {
      let _constructor = null;
      if (this.isValidAbi) {
        JSON.parse(this.abi).forEach(item => {
          if (item.type === 'constructor') {
            _constructor = item;
          }
        });
      }

      // Sets radio buttons to false due to vue reactivity
      if (_constructor && _constructor.hasOwnProperty('inputs')) {
        _constructor.inputs.forEach(item => {
          if (item.type === 'bool') {
            // eslint-disable-next-line
            this.inputs[item.name] = false;
          }
        });
      }
      return _constructor;
    },
    rawByteCode() {
      try {
        const remixBytecode = JSON.parse(this.bytecode);
        if (
          remixBytecode.object &&
          Misc.validateHexString(remixBytecode.object)
        )
          return '0x' + remixBytecode.object;
      } catch (err) {
        return this.bytecode;
      }
    },
    isValidByte() {
      return (
        this.rawByteCode &&
        this.rawByteCode.substr(0, 2) === '0x' &&
        Misc.validateHexString(this.rawByteCode)
      );
    },
    txByteCode() {
      return Misc.sanitizeHex(this.rawByteCode);
    },
    deployArgs() {
      const _deployArgs = [];
      if (this.abiConstructor) {
        this.abiConstructor.inputs.forEach(item => {
          if (item.type.includes('[') && item.type.includes(']')) {
            const inputs = this.inputs.hasOwnProperty(item.name)
              ? this.inputs[item.name].replace(/\s/g, '')
              : '';
            const arr = inputs.split(',');
            _deployArgs.push(arr);
          } else {
            _deployArgs.push(this.inputs[item.name]);
          }
        });
      }
      return _deployArgs;
    },
    txData() {
      return this.abi !== ''
        ? new this.web3.eth.Contract(JSON.parse(this.abi))
            .deploy({ data: this.txByteCode, arguments: this.deployArgs })
            .encodeABI()
        : '0x';
    },
    allValid() {
      let _allvalid = true;
      if (this.abiConstructor) {
        this.abiConstructor.inputs.forEach((item, idx) => {
          if (
            !this.isValidInput(
              this.deployArgs[idx],
              this.getType(item.type).solidityType
            )
          )
            _allvalid = false;
        });
      }
      return _allvalid && this.isValidAbi && this.isValidByte;
    }
  },
  methods: {
    clear() {
      this.bytecode = '';
      this.abi = '';
      this.contractName = '';
    },
    isValidInput: Misc.isContractArgValid,
    getType: Misc.solidityType,
    async sendTransaction() {
      try {
        await this.estimateGas();
        const web3 = this.web3;
        const coinbase = await web3.eth.getCoinbase();
        const nonce = await web3.eth.getTransactionCount(coinbase);
        const _tx = new Transaction({
          nonce: nonce,
          value: this.txValue,
          gasPrice: Misc.sanitizeHex(
            ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
          ),
          gasLimit: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
          data: this.txData
        });
        const json = _tx.toJSON(true);
        delete json.to;
        json.from = coinbase;
        this.web3.eth.sendTransaction(json).catch(err => {
          Toast.responseHandler(err, Toast.WARN);
        });
        const contractAddr = bufferToHex(generateAddress(coinbase, nonce));
        this.pushContractToStore(contractAddr);
        this.clear();
      } catch (e) {
        Toast.responseHandler(e, false);
      }
    },
    pushContractToStore(addr) {
      const localStoredContract = store.get('customContracts') || [];
      const itemIndex = localStoredContract.findIndex(item => {
        return item.name.toLowerCase() === this.contractName.toLowerCase();
      });
      if (itemIndex === -1) {
        const storableObj = {
          abi: JSON.parse(this.abi),
          address: addr,
          comment: '',
          name: this.contractName
        };
        localStoredContract.push(storableObj);
      } else {
        localStoredContract[itemIndex] = {
          abi: JSON.parse(this.abi),
          address: addr,
          comment: '',
          name: this.contractName
        };
      }
      store.set('customContracts', localStoredContract);
    },
    confirmationModalOpen() {
      this.sendTransaction();
      window.scrollTo(0, 0);
    },
    async estimateGas() {
      const coinbase = await this.web3.eth.getCoinbase();
      const params = {
        from: coinbase,
        data: this.txData,
        value: this.txValue
      };
      this.gasLimit = await this.web3.eth.estimateGas(params).catch(err => {
        Toast.responseHandler(err, Toast.WARN);
      });
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    deleteInput(ref) {
      this[ref] = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DeployContractContainer.scss';
</style>
