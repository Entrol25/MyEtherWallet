<template>
  <div class="view-wallet-info-layout">
    <interface-balance-modal ref="balance" :balance="balance" />
    <view-private-key-modal ref="viewPriv" />
    <print-modal ref="printModal" :address="account.address" />
    <div class="title">
      <h2>{{ $t('footer.view-wallet-info') }}</h2>
      <p>
        {{ $t('accessWallet.wallet-options') }}
      </p>
    </div>
    <div class="wallet-info-container">
      <div class="wallet-info">
        <div class="wallet-info-header">
          <h3>{{ $t('accessWallet.wallet-info') }}</h3>
          <router-link to="/interface">{{
            $t('common.wallet.access')
          }}</router-link>
        </div>
        <div class="balance-container">
          <div class="balance-main-container">
            <h4>{{ $t('common.balance.string') }}</h4>
            <div class="balance-and-buttons">
              <p>
                <b v-show="!fetchingBalance">{{ balance }}</b>
                <i
                  v-show="fetchingBalance"
                  class="fa fa-spinner fa-lg fa-spin"
                />
                {{ $t('common.currency.eth') }}
              </p>
              <div class="balance-button-container">
                <i class="fa fa-refresh fa-lg" @click="fetchBalance" />
                <img
                  src="~@/assets/images/icons/more-black.svg"
                  @click="openBalance"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="account-details">
          <div class="blockie-container">
            <blockie :address="account.address" width="80px" height="80px" />
            <i18n tag="h3" path="common.wallet.own">
              <span slot="nickname">{{ account.nickname }}</span>
            </i18n>
            <div class="address-copy-container">
              <input ref="copyAddress" :value="account.address" />
              <p>{{ account.address | concatAddr }}</p>
              <img src="@/assets/images/icons/copy-colored.svg" @click="copy" />
            </div>
          </div>
          <div class="other-options">
            <div
              v-for="option in otherOptions"
              :key="option.key"
              :class="[
                disableItem(option.key) ? 'item-disabled' : '',
                'option-item'
              ]"
              @click="option.func"
            >
              <img
                :src="
                  disableItem(option.key) ? option.iconDisabled : option.icon
                "
              />
              <p>{{ option.name }}</p>
            </div>
            <a
              ref="downloadFile"
              :href="walletJson"
              :download="filename"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </div>
      <div class="wallet-tokens">
        <interface-tokens
          :tokens="tokens"
          :get-token-balance="getTokenBalance"
          :received-tokens="!loading"
          :reset-token-selection="setTokensWithBalance"
          :fetch-tokens="fetchTokens"
          :ads="false"
          :address="account.address"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast, Misc } from '@/helpers';
import store from 'store';
import TokenBalance from '@myetherwallet/eth-token-balance';
import PrintModal from '@/layouts/InterfaceLayout/components/PrintModal';
import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal';
import InterfaceTokens from '@/layouts/InterfaceLayout/components/InterfaceTokens';
import ViewPrivateKey from './components/ViewPrivateKey';
import { BigNumber } from 'bignumber.js';
import sortByBalance from '@/helpers/sortByBalance.js';
import Blockie from '@/components/Blockie';
import printer from '@/assets/images/icons/printer.svg';
import txnHistory from '@/assets/images/icons/tx-history-spinner.svg';
import privateKeyGrey from '@/assets/images/icons/private-key-grey.svg';
import privateKey from '@/assets/images/icons/private-key.svg';
import keystore from '@/assets/images/icons/download-keystore.svg';
import keystoreGrey from '@/assets/images/icons/download-keystore-grey.svg';
import createBlob from '@/helpers/createBlob.js';
import utils from 'web3-utils';

export default {
  components: {
    'interface-tokens': InterfaceTokens,
    blockie: Blockie,
    'print-modal': PrintModal,
    'view-private-key-modal': ViewPrivateKey,
    'interface-balance-modal': InterfaceBalanceModal
  },
  data() {
    return {
      tokens: [],
      loading: false,
      fetchingBalance: false,
      balance: '0',
      otherOptions: [
        {
          name: 'Private Key',
          key: 'privKey',
          icon: privateKey,
          iconDisabled: privateKeyGrey,
          func: () => {
            this.openViewPriv();
          }
        },
        {
          name: 'Txn History',
          key: 'txnHis',
          icon: txnHistory,
          iconDisabled: txnHistory,
          func: () => {
            this.openTxHistory();
          }
        },
        {
          name: 'Keystore File',
          key: 'keyStor',
          icon: keystore,
          iconDisabled: keystoreGrey,
          func: () => {
            this.downloadKeystore();
          }
        },
        {
          name: 'Print Wallet',
          key: 'printWal',
          icon: printer,
          iconDisabled: printer,
          func: () => {
            this.printWallet();
          }
        }
      ],
      walletJson: '',
      filename: '',
      build: BUILD_TYPE
    };
  },
  computed: {
    ...mapState(['account', 'network', 'web3']),
    hasNickname() {
      return this.account.nickname !== '';
    }
  },
  mounted() {
    this.fetchTokens();
    this.fetchBalance();
    if (
      !this.account.isHardware &&
      typeof this.account.keystore !== 'undefined'
    ) {
      this.walletJson = createBlob(
        JSON.parse(this.account.keystore).file,
        'mime'
      );
      this.filename = JSON.parse(this.account.keystore).name;
    }
  },
  destroyed() {
    this.tokens = [];
    this.loading = false;
    this.balance = '0';
    this.walletJson = '';
    this.filename = '';
    this.build = BUILD_TYPE;
  },
  methods: {
    disableItem(itemKey) {
      if (itemKey === 'privKey') {
        return !!this.account.isHardware;
      } else if (itemKey === 'keyStor') {
        if (Misc.isMewCx()) {
          return false;
        }
        return true;
      }
      return false;
    },
    printWallet() {
      this.$refs.printModal.$refs.print.show();
    },
    openBalance() {
      this.$refs.balance.$refs.balance.show();
    },
    downloadKeystore() {
      if (Misc.isMewCx()) {
        window.chrome.downloads.download({
          filename: this.filename,
          url: this.walletJson
        });
      } else {
        this.$refs.downloadFile.click();
      }
    },
    openViewPriv() {
      this.$refs.viewPriv.$refs.viewPriv.show();
    },
    openTxHistory() {
      // eslint-disable-next-line
      window.open(
        `${this.network.type.blockExplorerAddr.replace('[[address]]', '') +
          this.account.address}`,
        '_blank'
      );
    },
    async fetchBalance() {
      this.fetchingBalance = true;
      const balance = await this.web3.eth.getBalance(this.account.address);
      this.balance = utils.fromWei(balance, 'ether');
      this.fetchingBalance = false;
    },
    copy() {
      this.$refs.copyAddress.select();
      document.execCommand('copy');
      Toast.responseHandler(this.$t('common.copied'), Toast.INFO);
    },
    async getTokenBalance(token) {
      try {
        const contractAbi = [
          {
            name: 'balanceOf',
            type: 'function',
            constant: true,
            inputs: [{ name: 'address', type: 'address' }],
            outputs: [{ name: 'out', type: 'uint256' }]
          }
        ];

        const contract = new this.web3.eth.Contract(contractAbi);
        const data = contract.methods
          .balanceOf(this.account.address)
          .encodeABI();
        const balance = await this.web3.eth
          .call({
            to: token.address,
            data: data
          })
          .then(res => {
            let tokenBalance;
            if (Number(res) === 0 || res === '0x') {
              tokenBalance = 0;
            } else {
              const denominator = new BigNumber(10).pow(token.decimals);
              tokenBalance = new BigNumber(res).div(denominator).toString();
            }
            return tokenBalance;
          })
          .catch(e => {
            Toast.responseHandler(e, false);
          });
        return balance;
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async fetchTokens() {
      this.loading = true;
      const tb = new TokenBalance(this.web3.currentProvider);
      try {
        this.tokens = await tb.getBalance(this.account.address);
        this.tokens = this.tokens.map(token => {
          const denominator = new BigNumber(10).pow(token.decimals);
          const balance = new BigNumber(token.balance)
            .div(denominator)
            .toString();
          token.address = token.addr;
          token.balance = balance;
          delete token.addr;
          return token;
        });
        this.tokens = this.tokens.sort(sortByBalance);
        this.loading = false;
      } catch (e) {
        this.tokens = this.network.type.tokens.map(token => {
          token.balance = 'Load';
          return token;
        });
        this.tokens = this.tokens.sort(sortByBalance);
        this.loading = false;
      }
    },
    setTokensWithBalance() {
      const customStore = store.get('customTokens');
      if (
        customStore !== undefined &&
        customStore[this.network.type.name] !== undefined &&
        customStore[this.network.type.name].length > 0
      ) {
        new Promise(resolve => {
          const newArr = customStore[this.network.type.name].map(
            async token => {
              token.balance = await this.getTokenBalance(token);
              return token;
            }
          );
          Promise.all(newArr).then(res => {
            customStore[this.network.type.name] = res;
            store.set('customTokens', customStore);
            resolve(res);
          });
        })
          .then(res => {
            const allTokens = this.tokens
              .filter(token => token.balance > 0)
              .concat(res.filter(token => token.balance > 0));
            this.tokensWithBalance = allTokens;
            this.loading = true;
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } else {
        this.loading = true;
        this.tokensWithBalance = this.tokens.filter(token => token.balance > 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ViewWalletInfoLayout.scss';
</style>
