
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.ru',
    timeout: 40000,
    country: 'RU',
    store: 'dyson',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 40000;
    url = url.replace(/(https:\/\/shop.dyson.ru\/)?(.+)/g, 'https://shop.dyson.ru$2');
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
