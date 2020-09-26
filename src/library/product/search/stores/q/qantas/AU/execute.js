
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'qantas',
    domain: 'store.qantas.com',
    url: 'https://store.qantas.com/au/search/{searchTerms}',
    loadedSelector: 'div.productListingstyled__Grid-sc-124p81z-7',
    noResultsXPath: '//div[contains(@class,"productListingstyled__NoProducts-sc-124p81z-21")]',
    zipcode: '',
  },
};
