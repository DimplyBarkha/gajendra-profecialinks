
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    domain: 'mediamarkt.at',
    url: 'https://www.mediamarkt.at/de/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmatde',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[@id="search_no_result-top"]',
    zipcode: '',
  },
};
