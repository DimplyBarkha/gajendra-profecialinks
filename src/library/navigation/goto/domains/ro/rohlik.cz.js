module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'rohlik.cz',
        timeout: 50000,
        country: 'CZ',
        store: 'rohlik',
        zipcode: '',
    },
    implementation: async({ url }, parameters, context, dependencies) => {
        await context.goto(url, {
            first_request_timeout: 60000,
            block_ads: false,
            load_all_resources: true,
            images_enabled: true,
            timeout: 200000,
            waitUntil: 'load',
        });
    },
};