module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'metro.ca',
    timeout: 50000,
    country: 'CA',
    store: 'metro',
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
