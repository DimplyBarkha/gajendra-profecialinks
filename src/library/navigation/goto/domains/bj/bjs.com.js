/** @format */

module.exports = {
	implements: 'navigation/goto',
	parameterValues: {
		domain: 'bjs.com',
		country: 'US',
		store: 'bjs',
		timeout: 50000,
	},
	implementation: async ({ url }, parameters, context, dependencies) => {
		url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
		await context.setBlockAds(false);
		await context.setLoadAllResources(true);
		await context.setAntiFingerprint(false);
		await context.setLoadImages(true);
		await context.setJavaScriptEnabled(true);
		await context.goto(url, {
			timeout: 50000,
			waitUntil: 'load',
			checkBlocked: true,
			block_ads: false,
			load_all_resources: true,
			images_enabled: true,
		});
	},
};
