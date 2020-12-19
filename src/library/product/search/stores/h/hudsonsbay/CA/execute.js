
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    domain: 'thebay.com',
    url: 'https://www.thebay.com/search?q={searchTerms}&lang=en_CA&start=0&sz=24',
    loadedSelector: '.product.bfx-disable-product.standard',
    noResultsXPath: '//span[contains(text(), "weren’t able to find any results")] | //div[contains(@class, "product-detail product-wrapper")]',
    zipcode: '',
  },
};
