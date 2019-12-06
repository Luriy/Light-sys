import './utils/styles';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.directive('click-outside', {
	bind(el, binding) {
		function isChildOf(child, parent) {
			if (child.parentNode === parent) {
				return true;
			} else if (child.parentNode === null) {
				return false;
			} else {
				return isChildOf(child.parentNode, parent);
			}
		}
		document.body.addEventListener('click', function(e) {
			if (el == e.target || isChildOf(e.target, el)) {
			} else {
				eval(binding.value);
			}
		});
	},
	unbind(el, binding) {
		document.body.removeEventListener('click', binding.value);
	},
});

Vue.mixin({
	methods: {
		formatCurrency(value, symbol, afterDot) {
			value = value || '';
			symbol = symbol || '';
			afterDot = afterDot || 2;

			const num = (parseFloat(value) || 0).toFixed(afterDot).toString();
			const whole = num.split('.')[0];
			const fractal = num.split('.')[1];
			const result = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + fractal;

			return result.slice(0, 1) === '-' ? `-${symbol}${result.slice(1)}` : symbol + result;
		},
	},
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	vuetify,
	template: '<App/>',
});
