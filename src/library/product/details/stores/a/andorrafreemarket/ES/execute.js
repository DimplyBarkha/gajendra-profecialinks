
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    domain: 'andorrafreemarket.com',
    loadedSelector: 'div[class="product-view"]',
    noResultsXPath: '//div[contains(@class,"block_category_above_empty_collection")]',
    zipcode: '',
  },
};
