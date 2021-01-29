
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    domain: 'salontopper.nl',
    url: 'https://www.salontopper.nl/zoeken?q={searchTerms}&ipp=3',
    loadedSelector: 'div[class*="product-gallery"]',
    noResultsXPath: '//div[contains(@class, "bnr-text")] | //p[contains(text(), "zijn er geen")] | //div[@itemscope][contains(@itemtype, "Product")]',
    zipcode: '',
  },
};
