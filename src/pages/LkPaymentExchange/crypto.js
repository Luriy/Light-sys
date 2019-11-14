import Exchange from './index';

const mixin = {
  name: 'crypto',
};

export default {
  extends: Exchange,
  mixins: [mixin]
};
