
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'flaschenpost.de',
    timeout: 50000,
    country: 'DE',
    store: 'flaschenpost',
    zipcode: '28203',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 10000 } = parameters;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    // patch for synchronicity issue between json decoring and goto result
    try {
      // @ts-ignore
      await context.waitForSelector('div[class="fp-productList"]', 8000)      
    } catch (error) {
      await new Promise(r => setTimeout(r, 11000));
    }
  },
};