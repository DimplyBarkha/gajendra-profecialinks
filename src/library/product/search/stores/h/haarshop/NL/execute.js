
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'haarshop',
    domain: 'haarshop.nl',
    url: 'https://www.haarshop.nl/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'img.product-image-photo',
    noResultsXPath: '//div[contains(@class,"message notice")]//div',
    zipcode: '',
  },
};
