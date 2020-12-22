
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'trademe.co.nz',
    timeout: null,
    country: 'NZ',
    store: 'trademe',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    console.log('prod url is ' + url);
    if (url.includes('nz/a/market')) { await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true }); } else if (url.includes('nzmarket')) {
      url = url.replace('nzmarket', 'nz/a/market');
      console.log('new prod url is ' + url);
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
  },
};
