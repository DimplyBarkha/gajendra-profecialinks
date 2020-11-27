module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'rohlik.cz',
        timeout: 50000,
        country: 'CZ',
        store: 'rohlik',
        zipcode: '',
    },
    implementation: async(inputs, parameterValues, context, dependencies) => {
        const url = `${inputs.url}`;
        await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector(('a[class*="imgWrapper"]'), { timeout: 100000 });
        await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    },
};