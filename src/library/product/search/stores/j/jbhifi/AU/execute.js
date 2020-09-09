
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    domain: 'jbhifi.com.au',
    url: 'https://www.jbhifi.com.au/?q={searchTerms}&hPP=150',
    loadedSelector: 'div.product-tile__image--aspect-ratio>img',
    noResultsXPath: '//*[@class="no-search-result"]',
    zipcode: '',
  },
};
