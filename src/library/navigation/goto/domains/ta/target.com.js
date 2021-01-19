module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'target.com',
    store: 'target',
    timeout: 60000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setUseRelayProxy(false);
    await context.setJavaScriptEnabled(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    //zipcode is hard coded into openSearchDefinition template for both goto and paginate 
  },
};
