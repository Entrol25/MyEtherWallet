<template>
  <div class="crypto-kitties-details">
    <div class="crypto-kitties-details-content-container">
      <back-button @click.native="goBack" />
      <div class="grid-container">
        <div class="kitty-image">
          <img :src="getImage(nft)" alt />
        </div>
        <div class="kitty-text">
          <h3>{{ $t('nftManager.send-my', { value: selectedTitle }) }}</h3>
          <p>#{{ nft.token }}</p>
          <div class="address-input-container">
            <dropdown-address-selector
              :title="$t('sendTx.to-addr')"
              @toAddress="prepareTransfer"
            />
            <div class="send-button-container">
              <standard-button
                :button-disabled="!isValidAddress"
                :options="sendButton"
                @click.native="transfer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import SmallBackButton from '@/layouts/InterfaceLayout/components/SmallBackButton';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import StandardButton from '@/components/Buttons/StandardButton';
import placeholderImage from '@/assets/images/icons/defaultToken.png';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'back-button': SmallBackButton,
    'dropdown-address-selector': DropDownAddressSelector,
    'standard-button': StandardButton
  },
  props: {
    selectedTitle: {
      type: String,
      default: 'Error'
    },
    nft: {
      type: Object,
      default: function() {
        return {};
      }
    },
    selectedContract: {
      type: String,
      default: 'Error'
    },
    nftConfig: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      toAddress: '',
      tokenContract: {},
      ERC721tokenContract: {},
      cryptoKittiesContract: {},
      cryptoKittiesConfig: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      sendButton: {
        title: this.$t('sendTx.send'),
        buttonStyle: 'green',
        helpCenter: true,
        noMinWidth: true,
        fullWidth: true
      },
      isValidAddress: false
    };
  },
  computed: {
    ...mapState(['account', 'web3'])
  },
  watch: {},
  mounted() {
    this.ERC721tokenContract = new this.web3.eth.Contract([
      {
        constant: false,
        inputs: [
          { name: '_from', type: 'address' },
          { name: '_to', type: 'address' },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'transferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]);
  },
  methods: {
    getImage(nft) {
      if (nft.customNft) {
        return placeholderImage;
      }
      return nft.image;
    },
    prepareTransfer(toAddress) {
      this.toAddress = toAddress.address;
      this.isValidAddress = toAddress.valid;
      this.ERC721tokenContract.options.address = this.nft.contract;
    },
    buildData() {
      if (
        this.nft.contract.toLowerCase() ===
        this.cryptoKittiesConfig.toLowerCase()
      ) {
        this.cryptoKittiesContract = new this.web3.eth.Contract([
          {
            constant: false,
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_tokenId', type: 'uint256' }
            ],
            name: 'transfer',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ]);

        return this.cryptoKittiesContract.methods
          .transfer(this.toAddress, this.nft.token)
          .encodeABI();
      }
      return this.ERC721tokenContract.methods
        .transferFrom(this.account.address, this.toAddress, this.nft.token)
        .encodeABI();
    },
    transfer() {
      if (this.isValidAddress) {
        const txData = this.buildData();
        const raw = {
          from: this.account.address,
          to: this.nft.contract,
          data: txData
        };
        this.web3.eth
          .sendTransaction(raw)
          .on('transactionHash', () => {
            this.$emit('nftTransferred', this.nft);
            this.toAddress = '';
          })
          .catch(err => {
            this.$emit('resetNFT', this.nft);
            Toast.responseHandler(err, Toast.ERROR);
          });
      }
    },
    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NftDetails';
</style>
