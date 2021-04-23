module.exports = function (api) {
	const presets = [
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'usage',
				corejs: { version: '3.10', proposals: true },
				targets: { node: 'current' }
			}
		],
		[
			'@babel/preset-react',
			{
				runtime: 'automatic'
			}
		],
		['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
		'minify'
	];

	const plugins = ['@babel/plugin-syntax-dynamic-import'];

	api.cache.invalidate(() => process.env.NODE_ENV);

	return {
		presets,
		plugins
	};
};
