module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', '@vue/standard'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		semi: 0,
		'no-tabs': 0,
		indent: 0,
		'comma-dangle': 0,
		'no-extra-semi': 0,
		'space-before-function-paren': 0,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
