const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function addManufacturer() {
    try {
      const manufacturer = window.__INITIAL_STATE__.product.card.meta.owner.contacts.pop().name;
      function getElementsByXPath(xpath, parent) {
        const results = [];
        const query = document.evaluate(xpath, parent || document,
          null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim();
          results.push(node);
        }
        return results.filter(e => e);
      }
      const descriptionArr = getElementsByXPath('//div[contains(@class,"product-summary_root")]/p | //div[contains(@class,"product-summary_root")]/ul/li | //div[@class="product-info-description"]/ul/li | //div[@class="product-info-description"]/div[contains(@class,"product-summary")] | //div[starts-with(@class,"product-card-hero_contentSection")]/div[@class="product-summary"]');
      var dietarySymbolArr = getElementsByXPath('//ul[starts-with(@class,"product-card-features_root")]/li');
      var description = descriptionArr.join(' || ') + ' ' + dietarySymbolArr.join(' ');
      document.body.setAttribute('description', description);
      document.body.setAttribute('manufacturer', manufacturer);
    } catch (err) {
      console.log('Could not add manufacturer');
    }
  }

  await context.evaluate(addManufacturer);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'albertheijn',
    transform,
    domain: 'ah.nl',
  },
  implementation,
};
