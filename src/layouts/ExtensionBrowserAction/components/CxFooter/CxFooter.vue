<template>
  <div class="footer">
    <!-- Modal -->
    <feedback-modal />
    <div class="wrap">
      <div>
        <div class="grid-col-1-1-1-2 footer-contents">
          <div
            v-for="(item, index) in footerContent"
            :ref="item.class"
            :class="item.class"
            :key="item.title + index"
          >
            <div class="content-title" @click="toggler(item.class)">
              <h3 class="lite">{{ item.title }}</h3>
              <p class="open" @click="openContent(item.class)">
                <i class="fa fa-plus" aria-hidden="true" />
              </p>
              <p class="close" @click="closeContent(item.class)">
                <i class="fa fa-minus" aria-hidden="true" />
              </p>
            </div>
            <div class="content-links">
              <div class="content-links-animation-block">
                <div
                  v-for="(content, index) in item.contents"
                  :key="content.text + index"
                  class="content"
                >
                  <div v-if="content.text === $t('common.customerSupport')">
                    <customer-support :no-icon="true" />
                  </div>
                  <router-link
                    v-else-if="content.to !== undefined"
                    :to="content.to"
                  >
                    <p>{{ content.text }}</p>
                  </router-link>
                  <a
                    v-else-if="content.to === undefined"
                    :href="content.href"
                    :aria-label="content.text"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p v-if="item.class === 'e2'">
                      {{ $t(`${content.text}`) }}
                    </p>
                    <p v-else>{{ content.text }}</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="donate-us">
            <div class="content-title">
              <h3 class="lite">
                <i18n path="footer.title.love" tag="h3">
                  <img
                    slot="heart"
                    src="~@/assets/images/icons/heart.svg"
                    alt
                  />
                </i18n>
              </h3>
            </div>
            <div class="links">
              <p>{{ $t('footer.donation.desc') }}</p>

              <a
                :href="'https://etherscan.io/address/' + ethDonationAddress"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p :data-eth="ethDonationAddress" class="crypto-link">
                  <img src="@/assets/images/currency/eth.svg" alt />
                  &nbsp;{{ $t('footer.donation.ether') }}
                </p>
              </a>

              <a
                href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p
                  class="crypto-link no-padding"
                  data-btc="1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
                >
                  <img src="@/assets/images/currency/btc.svg" alt />
                  &nbsp;{{ $t('footer.donation.bitcoin') }}
                </p>
              </a>
            </div>
          </div>
        </div>
        <div class="flex-space-between foot-note">
          <div class="links">
            <div v-for="(link, index) in lowerLinks" :key="link.title + index">
              <router-link v-if="link.hasOwnProperty('to')" :to="link.to">
                <span>{{ link.title }}</span>
              </router-link>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{{ link.title }}</span>
              </a>
            </div>
          </div>
          <div class="copyright">
            <p>
              {{ $t('footer.pricing-p') }}
              <a
                href="https://coingecko.com/"
                target="_blank"
                rel="noopener noreferrer"
                >CoinGecko</a
              >
              <br />
              {{ $t('footer.copyright') }}
            </p>
          </div>
          <div class="social">
            <a
              v-for="link in links"
              :href="link.to"
              :key="link.class"
              :aria-label="link.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i :class="'fa ' + link.class" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FeedbackModal from '@/components/FeedbackModal';
import CustomerSupport from '@/components/CustomerSupport';
import affiliates from './affiliates.js';
const version = VERSION;
import { Misc } from '@/helpers';

export default {
  components: {
    'feedback-modal': FeedbackModal,
    'customer-support': CustomerSupport
  },
  data() {
    const isMewCx = Misc.isMewCx();
    return {
      isMewCx: isMewCx,
      version: version,
      lowerLinks: [
        {
          title: this.$t('footer.feedback'),
          href: 'mailto:support@myetherwallet.com'
        },
        {
          title: this.$t('footer.privacy'),
          to: '/privacy-policy'
        },
        {
          title: this.$t('common.terms'),
          to: '/terms-of-service'
        },
        {
          title: `v${version}`,
          href: `https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${version}`
        }
      ],
      footerContent: [
        {
          class: 'e1',
          title: this.$t('footer.title.discover'),
          contents: [
            {
              text: this.$t('footer.units'),
              to: '/convert-units'
            },
            // {
            //   text: this.$t('footer.advanced'),
            //   to: '/advanced-tools'
            // },
            {
              text: this.$t('footer.extension'),
              href: 'https://www.mewcx.com'
            },
            {
              text: 'Buy a Hardware wallet',
              to: '/hardware-wallet-affiliates'
            },
            {
              text: this.$t('footer.sendOffline'),
              to: '/send-offline-helper'
            },
            {
              text: this.$t('footer.verifyMessage'),
              to: '/verify-message'
            },
            {
              text: this.$t('footer.viewWalletInfo'),
              to: '/view-wallet-info'
            },
            {
              text: 'Submit Dapp',
              to: '/dapp-submission'
            }
          ]
        },
        {
          class: 'e2',
          title: this.$t('footer.title.affiliates'),
          contents: affiliates
        },
        {
          class: 'e3',
          title: this.$t('footer.title.mew'),
          contents: [
            {
              text: this.$t('footer.about'),
              to: '/#about-mew'
            },
            {
              text: this.$t('footer.team'),
              to: '/team'
            },
            {
              text: this.$t('common.faqs'),
              to: '/#faqs'
            },
            {
              text: 'MEWtopia',
              href: 'https://www.mewtopia.com'
            },
            {
              text: this.$t('common.customerSupport'),
              href: 'mailto:support@myetherwallet.com'
            },
            {
              text: 'Help Center',
              href: 'https://kb.myetherwallet.com'
            }
          ]
        }
      ],
      links: [
        {
          to: 'https://www.facebook.com/myetherwallet',
          class: 'fa-facebook'
        },
        {
          to: 'https://www.twitter.com/@myetherwallet',
          class: 'fa-twitter'
        },
        {
          to: 'https://www.instagram.com/myetherwallet',
          class: 'fa-instagram'
        },
        {
          to: 'https://www.linkedin.com/company/myetherwallet',
          class: 'fa-linkedin'
        },
        {
          to: 'https://www.github.com/myetherwallet',
          class: 'fa-github'
        },
        {
          to: 'https://www.reddit.com/r/myetherwallet',
          class: 'fa-reddit-alien'
        },
        {
          to: 'https://www.medium.com/@myetherwallet',
          class: 'fa-medium'
        }
      ]
    };
  },
  computed: {
    ...mapState(['ethDonationAddress'])
  },
  mounted() {
    if (Misc.isMewCx()) {
      this.footerContent[0].contents = this.footerContent[0].contents.filter(
        item => {
          if (item.to !== '/send-offline-helper') return item;
        }
      );

      this.footerContent[2].contents = this.footerContent[2].contents.filter(
        item => {
          if (item.to !== '/#about-mew' && item.to !== '/#faqs') return item;
        }
      );
    }
  },
  methods: {
    openFeedbackModal() {
      this.$children[0].$refs.feedback.show();
    },
    openContent(element) {
      const openButton = document.querySelector('.' + element + ' .open');
      const closeButton = document.querySelector('.' + element + ' .close');
      const content = document.querySelector('.' + element + ' .content-links');
      openButton.style.display = 'none';
      closeButton.style.display = 'block';
      content.classList.remove('mobile-hide');
    },
    closeContent(element) {
      const openButton = document.querySelector('.' + element + ' .open');
      const closeButton = document.querySelector('.' + element + ' .close');
      const content = document.querySelector('.' + element + ' .content-links');
      openButton.style.display = 'block';
      closeButton.style.display = 'none';
      content.classList.add('mobile-hide');
    },
    toggler(ref) {
      const el = this.$refs[ref][0];
      el.classList.toggle('content-open');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CxFooter.scss';
</style>
