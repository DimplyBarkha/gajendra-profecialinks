
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    domain: 'brack.ch',
    url: 'https://www.brack.ch/search?query={searchTerms}',
    loadedSelector: 'img.productList__itemImage.js-productListImage',
    noResultsXPath: '//div[contains(@class, "hasNoSearchResults js-hasNoSearchResults")]',
    zipcode: '',
  },
};
