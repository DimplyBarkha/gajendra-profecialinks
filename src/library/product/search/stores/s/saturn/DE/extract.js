const { transform } = require('./transform');
/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function getRatingAndThumbnail () {
    const nodes = Array.from(document.querySelectorAll('div[data-test="mms-search-srp-productlist"] div[data-test="mms-search-srp-productlist-item"] a'));
    for (const node of nodes) {
      const productId = node.getAttribute('href').match(/([^-]+).html/)[1];
      const API = `https://www.saturn.de/api/v1/graphql?operationName=GetSelectProduct&variables={"hasMarketplace":false,"id":"${productId}"}&extensions={"pwa":{"salesLine":"Saturn","country":"DE","language":"de"},"persistedQuery": {"version":1,"sha256Hash":"bf21cd23afefaf0e92d339815ffe1da9ed05b7fdbeb5f00dcf5478e5abdfee89"}}`;
      const response = await fetch(API);
      const json = await response.json();
      const rating = json.data && json.data.reviews && json.data.reviews.rating;
      const thumbnail = json.data && json.data.product && json.data.product.assets.find(elm => elm.usageType === 'Product Image');
      if (thumbnail) {
        node.setAttribute('thumbnail', thumbnail.link);
      }
      if (rating) {
        node.setAttribute('rating-count', rating.count);
      }
      const searchUrl = window.location.href;
      document.body.setAttribute('search-url', searchUrl);
    }
  }
  await context.evaluate(getRatingAndThumbnail);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    transform,
    domain: 'saturn.de',
    zipcode: '',
  },
  implementation,
};
