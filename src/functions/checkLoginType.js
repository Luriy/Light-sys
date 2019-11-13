import Inputmask from 'inputmask';

export default (elem, loginType, user) => {
  console.log(elem, loginType, user)
	var pattern = /^[\d\(\)\ \- \+ \_]{0,100}$/;
	var im = new Inputmask('+9 (999) 999 99-99');

	if (loginType === 'Phone' && user && user != '+') {
		im.mask(elem);
	} else {
		if (elem.inputmask) {
			elem.inputmask.remove();
		}
  }
  console.log(pattern.test(user))
  return user === "" ? 'Email' : pattern.test(user) ? 'Phone' : 'Email';
};
