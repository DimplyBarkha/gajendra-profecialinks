module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'belk',
    domain: 'belk.com',
    url: 'https://www.belk.com/search/?q={searchTerms}&lang=default',
    loadedSelector: 'ul[id="search-result-items"], h1[class="search-result-data"]',
    noResultsXPath: '//h1[@class="search-result-data"] | //button[@id="add-to-cart"]',
    zipcode: '',
  },
};
