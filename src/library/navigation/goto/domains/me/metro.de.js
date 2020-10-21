module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'metro.de',
        timeout: 50000,
        country: 'DE',
        store: 'metro',
        zipcode: '',
    },
    implementation: async({ url, zipcode, storeId },
        parameters, context, dependencies,
    ) => {
        await context.setCssEnabled(true);
        await context.setLoadImages(true);
        await context.setLoadAllResources(true);
        await context.goto(url);
    }
};