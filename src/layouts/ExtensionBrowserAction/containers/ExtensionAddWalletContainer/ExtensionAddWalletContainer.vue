<template>
  <div class="add-wallet-container">
    <import-mnemonic-modal
      ref="mnemonicPhrase"
      :open-address-option="openAddressOption"
      :password="password"
      @mnemonicPhrase="updateMnemonic"
      @passwordUpdated="updatePassword"
    />
    <generate-wallet-modal
      ref="generateNewWallet"
      :generate-wallet="generateWallet"
      :loading="loading"
      :nickname="nickname"
      :password="password"
      @nicknameUpdated="updateNickname"
      @passwordUpdated="updatePassword"
    />
    <verify-details-modal
      ref="verifyDetails"
      :wallet="wallet"
      :title="title"
      :back="back"
      :add-wallet="addWalletToStore"
      :usd="ethPrice"
      :nickname="nickname"
      @nicknameUpdated="updateNickname"
    />
    <import-private-key-modal
      ref="importPrivateKey"
      :generate-wallet="generateWalletFromPriv"
      :priv-key="privateKey"
      :loading="loading"
      :password="password"
      @privateKey="updatePrivKey"
      @passwordUpdated="updatePassword"
    />
    <import-keystore-modal
      ref="importKeystore"
      :filepath="filepath"
      :loading="loading"
      :unlock-json="unlockJson"
      :password="password"
      @filepath="updateFilePath"
      @file="updateFile"
      @passwordUpdated="updatePassword"
    />
    <network-address-modal
      ref="networkAddress"
      :generate-from-mnemonic-priv="generateFromMnemonicPriv"
      :wallet-instance="wallet"
      :loading="loading"
      :password="password"
      @accountPath="updateSelectedPath"
      @passwordUpdated="updatePassword"
    />
    <h2>{{ $t('mewcx.add-my-wallet') }}</h2>
    <p>{{ $t('mewcx.how-would-you-add-wallet') }}</p>
    <div class="add-wallet-options">
      <access-wallet-button
        v-for="(button, index) in options"
        :key="button.title + index"
        :func="button.func"
        :img="button.icon"
        :title="button.title"
        :recommend="button.warning"
        :disabled="false"
        :classname="'extension-selection'"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { WalletInterface, MnemonicWallet } from '@/wallets';
import {
  KEYSTORE as keyStoreType,
  PRIV_KEY as privateKeyType,
  MNEMONIC as mnemonicType
} from '@/wallets/bip44/walletTypes';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { SELECTED_MEW_CX_ACC } from '@/builds/mewcx/cxHelpers/cxEvents.js';
import { Toast, ExtensionHelpers, Wallet, Misc } from '@/helpers';

import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
import privateKeyImgHov from '@/assets/images/icons/button-key-hover.svg';
import generateImgHov from '@/assets/images/icons/button-generate-hover.svg';
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton';
import ImportKeystoreModal from '../../components/ImportKeystoreModal';
import ImportPrivateKeyModal from '../../components/ImportPrivateKeyModal';
import VerifyDetailsModal from '../../components/VerifyDetailsModal';
import GenerateWalletModal from '../../components/GenerateWalletModal';
import ImportMnemonicModal from '../../components/ImportMnemonicModal';
import NetworkAndAddressModal from '../../components/NetworkAndAddressModal';

import { isAddress } from '@/helpers/addressUtils';
export default {
  components: {
    'access-wallet-button': AccessWalletButton,
    'import-keystore-modal': ImportKeystoreModal,
    'import-private-key-modal': ImportPrivateKeyModal,
    'verify-details-modal': VerifyDetailsModal,
    'import-mnemonic-modal': ImportMnemonicModal,
    'generate-wallet-modal': GenerateWalletModal,
    'network-address-modal': NetworkAndAddressModal
  },
  data() {
    return {
      options: [
        {
          key: 'GEN',
          icon: generateImgHov,
          title: 'Generate a New Wallet',
          warning: '',
          func: () => {
            this.toggleGenerateWallet(true);
          }
        },
        {
          key: mnemonicType,
          icon: byMnemImgHov,
          title: 'Mnemonic Phrase',
          warning: '',
          func: () => {
            this.toggleImportMnemonicPhrase(true);
          }
        },
        {
          key: privateKeyType,
          icon: privateKeyImgHov,
          title: `Private \n Key`,
          warning: '',
          func: () => {
            this.toggleImportPrivateKey(true);
          }
        },
        {
          key: keyStoreType,
          icon: byJsonImgHov,
          title: 'Keystore File (UTC/JSON)',
          warning: '',
          func: () => {
            this.toggleImportKeystoreFile(true);
          }
        }
      ],
      filepath: '',
      file: '',
      password: '',
      wallet: {},
      loading: false,
      title: '',
      nickname: '',
      generateOnly: false,
      privateKey: '',
      mnemonicPhrase: '',
      internalMnem: '',
      selectedAccountPath: '',
      selectedAddress: '',
      accCount: 0,
      ethPrice: 0
    };
  },
  computed: {
    ...mapState(['path', 'linkQuery'])
  },
  mounted() {
    this.$refs.mnemonicPhrase.$refs.mnemonicPhrase.$on('hidden', () => {
      this.internalMnem = this.mnemonicPhrase;
      this.mnemonicPhrase = new Array(this.mnemonicSize).fill('');
      this.password = '';
    });
    this.$refs.networkAddress.$refs.networkAddress.$on('hidden', () => {
      if (this.selectedAccountPath === '' || this.selectedAddress === '') {
        this.toggleImportMnemonicPhrase(true);
      }
      this.password = '';
      this.selectedAddress = '';
    });

    this.$refs.importPrivateKey.$refs.importPrivateKey.$on('hidden', () => {
      this.password = '';
      this.privateKey = '';
    });

    this.$refs.importKeystore.$refs.importKeystore.$on('hidden', () => {
      this.loading = false;
      this.password = '';
      this.filepath = '';
    });

    this.$refs.generateNewWallet.$refs.generateNewWallet.$on('hidden', () => {
      this.password = '';
      this.nickname = '';
    });

    this.$refs.verifyDetails.$refs.verifyDetails.$on('hidden', () => {
      this.nickname = '';
      this.loading = false;
    });
    this.fetchEthBalance();
  },
  methods: {
    async fetchEthBalance() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          // eslint-disable-next-line
          console.error(e);
        });

      this.ethPrice = price.data.ETH.quotes.USD.price;
    },
    openAddressOption() {
      this.loading = true;
      const mnemonicPhrase = this.mnemonicPhrase;
      MnemonicWallet(mnemonicPhrase, this.password)
        .then(wallet => {
          this.loading = false;
          this.wallet = wallet;
          this.toggleImportMnemonicPhrase(false);
          this.toggleNetworkAddressModal(true);
        })
        .catch(e => {
          this.loading = false;
          Toast.responseHandler(e, Toast.ERROR);
          this.wallet = {};
        });
    },
    async generateFromMnemonicPriv() {
      this.loading = true;
      const privateKey = await ExtensionHelpers.getPrivFromMnemonicWallet(
        this.internalMnem,
        this.selectedAccountPath
      );

      this.internalMnem = this.mnemonicPhrase;
      this.generateWalletFromPriv(privateKey, 'mnem');
    },
    generateWalletFromPriv(priv, type) {
      this.loading = true;
      const privKey = priv ? priv : this.privateKey;
      const worker = new walletWorker();
      worker.postMessage({
        type: 'generateFromPrivateKey',
        data: [privKey, this.password]
      });
      worker.onmessage = e => {
        const newJson = {};
        this.loading = false;
        this.file = e.data.walletJson;
        Object.keys(this.file).forEach(key => {
          newJson[key.toLowerCase()] = this.file[key];
        });
        const _wallet = Wallet.fromV3(newJson, this.password, true);
        this.wallet = new WalletInterface(
          Buffer.from(_wallet._privKey),
          false,
          type !== 'priv' ? mnemonicType : privateKeyType
        );
        this.toggleImportPrivateKey(this.loading);
        this.toggleNetworkAddressModal(false);
        this.toggleVerifyDetails(
          true,
          type !== 'priv' ? mnemonicType : privateKeyType
        );
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        this.loading = false;
      };
    },
    generateWallet() {
      this.loading = true;
      this.generateOnly = true;
      const worker = new walletWorker();
      worker.postMessage({ type: 'createWallet', data: [this.password] });
      worker.onmessage = e => {
        this.file = e.data.walletJson;
        this.unlockJson();
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        this.loading = false;
      };
    },
    storeWalletCb() {
      this.loading = false;
      this.$eventHub.$emit('showSuccessModal', 'Successfully added a wallet!');
      this.$router.push('/');
      this.reset();
      this.toggleVerifyDetails(false, '');
    },
    reset() {
      this.filepath = '';
      this.file = '';
      this.password = '';
      this.wallet = {};
      this.loading = false;
      this.title = '';
      this.nickname = '';
      this.generateOnly = false;
      this.privateKey = '';
      this.mnemonicPhrase = '';
      this.selectedAccountPath = '';
      this.selectedAddress = '';
    },
    addWalletToStore(type) {
      this.loading = true;
      const chrome = window.chrome;
      const _self = this;
      const { connectionRequest } = _self.linkQuery;
      const account = _self.wallet.getAddressString();
      ExtensionHelpers.getAccounts(store => {
        _self.accCount = Object.keys(store).filter(item => {
          return isAddress(item);
        }).length;
      });
      const nickname =
        _self.nickname === '' ? `Wallet ${this.accCount}` : _self.nickname;
      // eslint-disable-next-line
      if (!!connectionRequest) {
        const service = Misc.getService(connectionRequest);
        const eventObj = {};
        eventObj[`${service.toLowerCase()}`] = account;
        ExtensionHelpers.addWalletToStore(
          account,
          JSON.stringify(_self.file),
          nickname,
          type,
          'add',
          _self.storeWalletCb
        );
        chrome.tabs.query({ url: `*://*.${service.toLowerCase()}/*` }, function(
          tab
        ) {
          const obj = {
            event: SELECTED_MEW_CX_ACC,
            payload: [account]
          };
          chrome.storage.sync.set(eventObj, function() {});
          chrome.tabs.sendMessage(tab[0].id, obj);
          window.close();
        });
      } else {
        ExtensionHelpers.addWalletToStore(
          account,
          JSON.stringify(_self.file),
          nickname,
          type,
          'add',
          _self.storeWalletCb
        );
      }
    },
    back() {
      if (this.wallet.identifier === keyStoreType) {
        this.toggleImportKeystoreFile(true);
      } else if (this.wallet.identifier === privateKeyType) {
        this.toggleImportPrivateKey(true);
      } else if (this.wallet.identifier === mnemonicType) {
        this.toggleImportMnemonicPhrase(true);
      } else {
        this.toggleGenerateWallet(true);
      }
      this.toggleVerifyDetails(false, '');
    },
    unlockJson() {
      this.loading = true;
      const worker = new walletWorker();
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = e => {
        this.wallet = new WalletInterface(
          Buffer.from(e.data._privKey),
          false,
          keyStoreType
        );
        this.loading = false;
        if (!this.generateOnly) {
          this.toggleImportKeystoreFile(this.loading);
          this.toggleVerifyDetails(true, keyStoreType);
        } else {
          this.addWalletToStore('wallet');
          this.toggleGenerateWallet(false);
        }
      };
      worker.onerror = e => {
        e.preventDefault();
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    toggleImportKeystoreFile(bool) {
      if (bool) this.$refs.importKeystore.$refs.importKeystore.show();
      if (!bool) this.$refs.importKeystore.$refs.importKeystore.hide();
    },
    toggleImportPrivateKey(bool) {
      if (bool) this.$refs.importPrivateKey.$refs.importPrivateKey.show();
      if (!bool) this.$refs.importPrivateKey.$refs.importPrivateKey.hide();
    },
    toggleImportMnemonicPhrase(bool) {
      if (bool) this.$refs.mnemonicPhrase.$refs.mnemonicPhrase.show();
      if (!bool) this.$refs.mnemonicPhrase.$refs.mnemonicPhrase.hide();
    },
    toggleGenerateWallet(bool) {
      if (bool) this.$refs.generateNewWallet.$refs.generateNewWallet.show();
      if (!bool) this.$refs.generateNewWallet.$refs.generateNewWallet.hide();
    },
    toggleNetworkAddressModal(bool) {
      if (bool) this.$refs.networkAddress.$refs.networkAddress.show();
      if (!bool) this.$refs.networkAddress.$refs.networkAddress.hide();
    },
    toggleVerifyDetails(bool, title) {
      if (bool) this.$refs.verifyDetails.$refs.verifyDetails.show();
      if (!bool) this.$refs.verifyDetails.$refs.verifyDetails.hide();
      this.title = title;
    },
    updateFilePath(e) {
      this.filepath = e.replace('fakepath', 'user-path');
    },
    updateNickname(e) {
      this.nickname = e;
    },
    updateFile(e) {
      this.file = e;
    },
    updatePassword(e) {
      this.password = e;
    },
    updatePrivKey(e) {
      this.privateKey = e;
    },
    updateMnemonic(e) {
      if (Array.isArray(e)) {
        this.mnemonicPhrase = e.join(' ');
      } else {
        Toast.responseHandler(this.$t('mew-cx.invalid-mnemonic'), Toast.ERROR);
      }
    },
    updateSelectedPath(e) {
      this.selectedAccountPath = e[0];
      this.selectedAddress = e[1];
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionAddWalletContainer.scss';
</style>
