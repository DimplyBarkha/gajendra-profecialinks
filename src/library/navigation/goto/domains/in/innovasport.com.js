module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'innovasport.com',
        timeout: 90000,
        country: 'MX',
        store: 'innovasport',
        zipcode: '',
    },
    implementation: async ({ url, zipcode, storeId },
            parameters, context, dependencies,
          ) => {
            await context.setCssEnabled(true);
            await context.setJavaScriptEnabled(true);
            await context.setLoadImages(true);
            await context.setLoadAllResources(true);
            await context.goto(url);
          },
};