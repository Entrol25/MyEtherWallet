<template>
  <div class="modal-container">
    <b-modal
      ref="network"
      :title="$t('common.network')"
      hide-footer
      centered
      class="bootstrap-modal network nopadding max-height-1"
      static
      lazy
    >
      <div class="content-block">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.advanced') }}</h4>
          <div class="margin-left-auto add-custom-network">
            <p>{{ $t('interface.network-modal.add-custom') }}</p>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  ref="addCustomToggle"
                  type="checkbox"
                  @click="addCustomNetworkToggle"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div ref="networkList" class="network-list">
        <div
          v-for="(key, index) in Object.keys(reorderedNetworks)"
          :key="key + index"
          class="content-block"
        >
          <div class="network-title">
            <div class="network-icon">
              <img :src="Networks[key][0].type.icon" alt />
            </div>
            <h4 :class="key.toLowerCase()">{{ key }}</h4>
          </div>
          <div class="grid-3">
            <p
              v-for="net in Networks[key]"
              :key="net.service"
              :class="
                net.service === network.service &&
                net.type &&
                net.type.name === network.type.name
                  ? 'current-network'
                  : ''
              "
              class="switch-network"
              @click="switchNetwork(net)"
            >
              {{ net.service }}
            </p>
          </div>
        </div>
        <div v-if="customNetworks.length > 0" class="content-block">
          <h4 class="cust">{{ $t('interface.network-modal.custom') }}</h4>
          <div
            v-for="(net, idx) in customNetworks"
            :key="net.service + '(' + net.type.name + ')' + idx"
            class="grid-3"
          >
            <div
              :class="
                net.service === network.service &&
                net.type.name === network.type.name
                  ? 'current-network'
                  : ''
              "
              class="switch-network custom-network-item"
            >
              <p @click="switchNetwork(net)">
                {{ net.service }} {{ '(' + net.type.name + ')' }}
              </p>
              <i
                class="fa fa-times-circle"
                @click.prevent="removeNetwork(net, idx)"
              />
            </div>
          </div>
        </div>
      </div>
      <form ref="networkAdd" class="network-add hidden">
        <div class="content-block">
          <div class="input-block-container">
            <input
              v-validate="'required'"
              v-model="name"
              :placeholder="$t('interface.network-modal.eth-node')"
              class="custom-input-text-1"
              type="text"
              name="nodeName"
              autocomplete="off"
            />
            <select v-model="selectedNetworkName" class="custom-select-1">
              <option
                v-for="type in types"
                :value="type.name"
                :key="type.name + type.name_long"
                :selected="selectedNetworkName === type.name"
              >
                {{ type.name | capitalize }} -
                {{ type.name_long | capitalize }}
              </option>
            </select>
            <input
              v-validate="{
                required: true,
                url: {
                  require_protocol: true,
                  protocols: ['http', 'https', 'ws', 'wss'],
                  require_tld: false
                }
              }"
              v-model="url"
              class="custom-input-text-1"
              type="text"
              name="nodeUrl"
              placeholder="URL"
              autocomplete="off"
            />
            <input
              v-model="port"
              :placeholder="$t('interface.network-modal.port')"
              class="custom-input-text-1"
              type="number"
              name="nodePort"
              autocomplete="off"
            />
            <input
              v-validate="'required|url:require_protocol'"
              v-show="selectedNetworkName === 'CUS'"
              v-model="blockExplorerTX"
              :placeholder="$t('interface.etherscan-tx-url')"
              class="custom-input-text-1"
              type="text"
              name="customExplorerTx"
              autocomplete="off"
            />
            <input
              v-validate="'required|numeric'"
              v-show="selectedNetworkName === 'CUS'"
              v-model="chainID"
              :placeholder="$t('common.chain-id')"
              class="custom-input-text-1"
              type="number"
              name="customChain"
              autocomplete="off"
            />
            <input
              v-validate="'required|url:require_protocol'"
              v-show="selectedNetworkName === 'CUS'"
              v-model="blockExplorerAddr"
              :placeholder="$t('interface.etherscan-address-url')"
              class="custom-input-text-1"
              type="text"
              name="customExplorerAddr"
              autocomplete="off"
            />
          </div>
          <div>
            <p v-show="errors.has('nodeName')">
              {{ errors.first('nodeName') }}
            </p>
            <p v-show="errors.has('nodeUrl')">{{ errors.first('nodeUrl') }}</p>
            <p
              v-show="
                errors.has('customExplorerTx') || blockExplorerTX.length > 0
              "
            >
              {{ errors.first('customExplorerTx') }}
            </p>
            <p v-show="errors.has('customChain') || (chainID && chainID > 0)">
              {{ errors.first('customChain') }}
            </p>
            <p
              v-show="
                errors.has('customExplorerAddr') || blockExplorerAddr.length > 0
              "
            >
              {{ errors.first('customExplorerAddr') }}
            </p>
          </div>
        </div>

        <div class="content-block">
          <div class="flex-container">
            <div>
              <h4 class="modal-title">
                {{ $t('interface.network-modal.http-access') }}
              </h4>
              <p class="warning-msg">
                {{ $t('interface.network-modal.warning') }}
              </p>
            </div>
            <div class="margin-left-auto add-custom-network">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input type="checkbox" @click="expendAuth" />
                  <span class="slider round" />
                </label>
              </div>
            </div>
          </div>
          <div ref="authForm" class="auth-form-container hidden">
            <input
              v-model="username"
              :placeholder="$t('interface.network-modal.user-name')"
              class="custom-input-text-1"
              type="text"
              name
              autocomplete="off"
            />
            <input
              v-model="password"
              :placeholder="$t('common.password.string')"
              class="custom-input-text-1"
              type="password"
              name
              autocomplete="off"
            />
          </div>
        </div>

        <div class="content-block">
          <div class="save-button-container">
            <button
              v-show="selectedNetworkName !== 'CUS'"
              :class="[
                errors.has('nodeName') ||
                errors.has('nodeUrl') ||
                url === '' ||
                name === ''
                  ? 'disabled'
                  : '',
                'save-button large-round-button-green-filled clickable'
              ]"
              @click.prevent="saveCustomNetwork"
            >
              {{ $t('common.save') }}
            </button>
            <button
              v-show="selectedNetworkName === 'CUS'"
              :class="[
                errors.has('nodeName') ||
                errors.has('nodeUrl') ||
                url === '' ||
                name === '' ||
                errors.has('customChain') ||
                errors.has('customExplorerTx') ||
                blockExplorerTX === '' ||
                !chainID ||
                blockExplorerAddr === '' ||
                errors.has('customExplorerAddr')
                  ? 'disabled'
                  : '',
                'save-button large-round-button-green-filled clickable'
              ]"
              @click.prevent="saveCustomNetwork"
            >
              {{ $t('common.save') }}
            </button>
            <interface-bottom-text
              :link-text="$t('common.help-center')"
              :question="$t('common.dont-know')"
              link="https://kb.myetherwallet.com"
            />
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import store from 'store';

import InterfaceBottomText from '@/components/InterfaceBottomText';
import * as networkTypes from '@/networks/types';
import nodeList from '@/networks';
import Misc from '@/helpers/misc';

import { mapState } from 'vuex';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  data() {
    return {
      types: networkTypes,
      selectedNetworkName: 'ETH',
      chainID: networkTypes['ETH'].chainID,
      port: 443,
      name: '',
      url: '',
      username: '',
      password: '',
      customNetworks: [],
      blockExplorerAddr: '',
      blockExplorerTX: ''
    };
  },
  computed: {
    ...mapState(['network', 'Networks', 'web3']),
    reorderedNetworks() {
      const networks = Misc.reorderNetworks();
      return networks;
    },
    selectedNetwork() {
      return this.types[this.selectedNetworkName];
    }
  },
  watch: {
    selectedNetworkName(val) {
      if (val !== 'CUS') {
        this.chainID = this.selectedNetwork.chainID;
      }
    }
  },
  mounted() {
    if (store.get('customNetworks') !== undefined) {
      this.customNetworks = store.get('customNetworks');
      if (this.customNetworks.length) {
        this.customNetworks.forEach(network => {
          if (network.type.name !== 'CUS') {
            network.type.contracts =
              nodeList[network.type.name][0].type.contracts;
            network.type.tokens = nodeList[network.type.name][0].type.tokens;
            network.type.ens = nodeList[network.type.name][0].type.ens;
          }
        });
      }
    }
    this.types['CUS'] = {
      name: 'CUS',
      name_long: 'CUSTOM',
      homePage: '',
      blockExplorerTX: '',
      blockExplorerAddr: '',
      chainID: networkTypes['ETH'].chainID,
      tokens: [],
      contracts: [],
      currencyName: 'CUS'
    };
    this.selectedNetworkName = this.network.type.name;
  },
  methods: {
    networkModalOpen() {
      this.$refs.network.$refs.network.show();
    },
    removeNetwork(net, idx) {
      this.customNetworks.splice(idx, 1);
      if (net.service === this.network.service) {
        if (this.customNetworks.length > 0) {
          this.switchNetwork(this.customNetworks[0]);
        } else {
          this.switchNetwork(this.Networks.ETH[0]);
        }
      }
      store.set('customNetworks', this.customNetworks);
    },
    addCustomNetworkToggle() {
      this.$refs.network.$el.classList.toggle('max-height-1');
      this.$refs.networkList.classList.toggle('hidden');
      this.$refs.networkAdd.classList.toggle('hidden');
    },
    resetCompState() {
      this.port = 443;
      this.name = '';
      this.url = '';
      this.username = '';
      this.password = '';
      this.blockExplorerAddr = '';
      this.blockExplorerTX = '';
    },
    saveCustomNetwork() {
      const customNetwork = {
        auth: this.password !== '' && this.username !== '',
        password: this.password,
        port: parseInt(this.port),
        service: this.name,
        url: this.url,
        username: this.username,
        type: {
          blockExplorerAddr:
            this.selectedNetwork.blockExplorerAddr ||
            this.blockExplorerAddr ||
            '',
          blockExplorerTX:
            this.selectedNetwork.blockExplorerTX || this.blockExplorerTX || '',
          chainID: parseInt(this.chainID),
          contracts: [],
          homePage: '',
          name: this.selectedNetwork.name,
          name_long: this.selectedNetwork.name_long,
          tokens: [],
          currencyName: this.selectedNetwork.currencyName
        }
      };
      const cloneCustomNetworks = [...this.customNetworks];
      cloneCustomNetworks.push(customNetwork);
      store.set('customNetworks', cloneCustomNetworks);
      if (this.selectedNetwork.name !== 'CUS') {
        customNetwork.type.contracts = this.selectedNetwork.contracts;
        customNetwork.type.tokens = this.selectedNetwork.tokens;
        customNetwork.type.ens = this.selectedNetwork.ens;
      }
      this.customNetworks.push(customNetwork);
      this.resetCompState();
      this.$refs.addCustomToggle.click();
    },
    expendAuth() {
      this.$refs.authForm.classList.toggle('hidden');
    },
    switchNetwork(network) {
      this.$store.dispatch('switchNetwork', network).then(() => {
        this.$store.dispatch('setWeb3Instance').then(() => {
          this.selectedNetworkName = network.type.name;
          if (Misc.isMewCx()) {
            this.web3.eth.net.getId().then(id => {
              window.chrome.storage.sync.set({
                defChainID: network.type.chainID,
                defNetVersion: id,
                defNetwork: JSON.stringify({
                  url: network.url,
                  key: network.type.name
                })
              });
            });
          }
        });
      });

      this.$refs.network.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceNetworkModal.scss';
</style>
