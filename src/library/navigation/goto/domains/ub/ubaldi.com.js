module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'ubaldi.com',
        timeout: null,
        country: 'FR',
        store: 'ubaldi',
        zipcode: '',
    },
    implementation: async({ url, zipcode, storeId }, parameters, context, dependencies) => {
        const timeout = parameters.timeout ? parameters.timeout : 50000;
        await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    },
};