import Exchange from './index';

const mixin = {
  name: 'fiat',
  methods: {
    fetchFiatPsids() {
      this.$store.dispatch('exchange/GET_FIAT_PSIDS');
    },
    fetchCards() {
      this.$store.dispatch('account/GET_CARDS');
    },
    fetchFiatExchange() {
      this.$store.dispatch('exchange/GET_FIAT_EXCHANGE');
    },
  },
  created() {
    this.fetchFiatPsids();
    this.fetchCards();
    this.fetchFiatExchange();
  },
  computed: {
    fiatList() {
      return this.$store.getters['exchange/FIAT_PSIDS'];
    },
    cardsList() {
      return this.$store.getters['account/CARDS'];
    },
  }
};

export default {
  extends: Exchange,
  mixins: [mixin]
};
