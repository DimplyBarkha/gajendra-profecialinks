
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'hagel-shop.de',
    timeout: 80000,
    country: 'DE',
    store: 'hagel-shop',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 10000 } = parameters;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    await new Promise((resolve) => setTimeout(resolve, 5000));
  },
};
