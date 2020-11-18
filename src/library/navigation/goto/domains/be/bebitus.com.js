module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'bebitus.com',
        timeout: null,
        country: 'ES',
        store: 'bebitus',
        zipcode: '',
    },
    implementation: async({ url }, parameters, context, dependencies) => {
        await context.goto(url, {
            first_request_timeout: 60000,
            block_ads: false,
            load_all_resources: true,
            embed_iframes: false,
            images_enabled: true,
            timeout: 200000,
            waitUntil: 'load',
        });
    },
};