
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'naszezoo.pl',
    timeout: 70000,
    country: 'PL',
    store: 'naszezoo',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
    await context.waitForSelector('div.price-del del', { timeout: 70000 })
      .catch(() => console.log('No sponsored products were found.'));
  },
};
