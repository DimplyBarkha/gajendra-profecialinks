
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    domain: 'salontopper.nl',
    url: 'https://www.salontopper.nl/zoeken?q={searchTerms}',
    loadedSelector: 'div[class*="product-gallery"]',
    noResultsXPath: '//p[contains(text(), "zijn er geen")]',
    zipcode: '',
  },
};
