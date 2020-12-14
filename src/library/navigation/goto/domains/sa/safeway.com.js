module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'safeway.com',
        timeout: 60000,
        country: 'US',
        store: 'safeway',
        zipcode: '95401',
    },
    implementation: async({ url, zipcode, storeId }, parameters, context, dependencies) => {
        const timeout = parameters.timeout ? parameters.timeout : 10000;
        await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
        console.log(zipcode);

        await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });

    },
};