module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'thegoodguys.com.au',
        timeout: null,
        country: 'AU',
        store: 'thegoodguys',
        zipcode: '3805',
    },
    implementation: async({ url, zipcode, storeId }, parameters, context, dependencies) => {
        const timeout = parameters.timeout ? parameters.timeout : 50000;
        await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
        console.log(zipcode);
        if (zipcode) {
            await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
        }
    },
};