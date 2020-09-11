
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'brownthomas.com',
    country: 'IE',
    store: 'brownthomas',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.goto(inputs.url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
