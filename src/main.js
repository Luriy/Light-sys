// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import styles from './assets/scss/styles.scss'

Vue.config.productionTip = false

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
        document.body.addEventListener('click', function(e){
        	if (el == e.target || isChildOf(e.target, el)) { 
			} else {
        		eval(binding.value);
        	}
        });
    },
    unbind(el, binding) {
        document.body.removeEventListener('click', binding.value);
    }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});