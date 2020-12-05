const { transform } = require('../../../../shared');
const { Helpers } = require('../../../../../../helpers/helpers');

const implementation = async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const helpers = new Helpers(context);

  const url = 'https://www.' + parameters.domain;
  const urlSuffixes = ['/devices/alto/shop-all', '/devices/vibe/shop-all', '/devices/solo/shop-all', '/flavors', '/accessories', '/discovervelo'];

  const completeUrlSet = new Set();
  while (urlSuffixes.length) {
    await context.goto(url + urlSuffixes.shift(), { timeout: 20000, waitUntil: 'load', checkBlocked: true })
      .then(async () => {
        const urls = await context.evaluate(() => {
          const links = [];
          document.querySelectorAll('div.product-item-info a[class*="product-item-photo"]').forEach(el => {
            links.push(el.getAttribute('href'));
          });
          if (!links.length) {
            console.log(`No urls return from ${window.location.href}`);
          }
          return links;
        });

        urls.forEach(url => completeUrlSet.add(url));
      })
      .catch((err) => console.log(`Issue in one of the gotos: ${err}`));
  }

  helpers.addItemToDocument('my-urls', Array.from(completeUrlSet));
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'vusevapor',
    transform,
    domain: 'vusevapor.com',
    zipcode: '',
  },
  implementation,
};
