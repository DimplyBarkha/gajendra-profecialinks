
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'frisco.pl',
    country: 'PL',
    timeout: 70000,
    store: 'frisco',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 10000 } = parameters;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });

    // patch for synchronicity issue between json decoring and goto result
    if (url.split('[!opt!]')[1] && url.split('[!opt!]')[1].includes('"type":"json"')) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  },
};