
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    country: 'US',
    store: 'totalwine',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    console.log(zipcode);
    if (zipcode === '95825') {
      url = `${url.replace(/s=(\d+)/g, 's=1108')}`;
    }
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
