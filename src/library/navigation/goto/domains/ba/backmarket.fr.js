
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'backmarket.fr',
    timeout: 900000,
    country: 'FR',
    store: 'backmarket',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    let lastResponseData = await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log('lastResponseData.status: ', lastResponseData.status);
      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        console.log('lastResponseData.status: ', lastResponseData.status);
      return;
      }
  },
};
