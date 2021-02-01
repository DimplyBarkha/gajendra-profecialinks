
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    domain: 'salontopper.nl',
    url: 'https://www.salontopper.nl/zoeken?q={searchTerms}&ipp=3',
    loadedSelector: 'div[class*="product-gallery"]',
    noResultsXPath: '//p[contains(text(), "zijn er geen")] | //div[@itemscope][contains(@itemtype, "Product")] | //p[contains(text(), "zijn er geen")] | //h1[contains(text(), "Helaas!")] | //p[contains(text(), "zijn er geen")] | //div[@itemscope][contains(@itemtype, "Product")] | //p[contains(text(), "zijn er geen")] | //h1[contains(text(), "Helaas!")] | //div[contains(@class, "bnr-text")][contains(text(), "HAARVERZORGING")]',
    zipcode: '',
  },
};
