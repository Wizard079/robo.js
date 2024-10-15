// @ts-check

/**
 * @type {import('robo.js').Config}
 **/
export default {
	experimental: {
		disableBot: true
	},
	plugins: [],
	type: 'plugin',
	watcher: {
		ignore: ['src/app', 'src/components', 'src/hooks']
	}
}
