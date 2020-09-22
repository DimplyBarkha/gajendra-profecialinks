
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    domain: 'trendyol.com',
    url: 'https://www.trendyol.com/tum--urunler?q={searchTerms}',
    loadedSelector: 'div.srch-prdcts-cntnr img',
    noResultsXPath: '//*[@class="srch-no-rslt"]',
    zipcode: '',
  },
};
