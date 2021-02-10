module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    domain: 'homedepot.com',
    url: 'https://www.homedepot.com/s/{searchTerms}',
    loadedSelector: 'img[class="stretchy"],div[class="product-details"]>div>span[class="product-title"] > h1',
    // loadedSelector: 'div.results-wrapped',
    noResultsXPath: '//div[@class="no-results-found-banner__body--1D0J6"]',
    zipcode: '',
  },
};
