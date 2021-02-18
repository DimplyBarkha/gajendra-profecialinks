
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'detmir.ru',
    timeout: null,
    jsonToTable: null,
    country: 'RU',
    store: 'detsky',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setFirstRequestTimeout(90000);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};
