<template>
  <div>
    <b-modal
      ref="print"
      :title="$t('createWallet.mnemonic.print.print-title')"
      hide-footer
      centered
      class="nopadding print-mod"
      size="lg"
      static
      lazy
    >
      <div class="modal-content-container">
        <div ref="printContainer" class="mnemonic-to-print">
          <mnemonic-table-to-print
            :mnemonic="mnemonic"
            :is-twenty-four="isTwentyFour"
            :build-type="buildType"
          />
        </div>
        <div class="mnemonic-to-display">
          <mnemonic-table-to-display
            :mnemonic="mnemonic"
            :is-twenty-four="isTwentyFour"
            :build-type="buildType"
          />
        </div>
        <div class="button-container">
          <standard-button
            :options="printButtonOptions"
            @click.native="print"
          />
        </div>
      </div>
      <!-- .modal-content-container -->
    </b-modal>
  </div>
</template>
<script>
import StandardButton from '@/components/Buttons/StandardButton';
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import MnemonicTableToPrint from './components/MnemonicTableToPrint';
import MnemonicTableToDisplay from './components/MnemonicTableToDisplay';

export default {
  components: {
    'standard-button': StandardButton,
    'mnemonic-table-to-print': MnemonicTableToPrint,
    'mnemonic-table-to-display': MnemonicTableToDisplay
  },
  props: {
    mnemonic: {
      type: Array,
      default: () => []
    },
    isTwentyFour: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      printButtonOptions: {
        title: 'Print',
        buttonStyle: 'green-border',
        noMinWidth: true,
        fullWidth: true
      },
      buildType: BUILD_TYPE
    };
  },
  methods: {
    async print() {
      const element = this.$refs.printContainer;
      const screen = await html2canvas(element, {
        async: true,
        logging: false,
        height: 800,
        width: 800,
        scrollY: 0
      }).then(canvas => {
        return canvas;
      });
      printJS({
        printable: screen.toDataURL('image/png'),
        type: 'image'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PrintModal.scss';
</style>
