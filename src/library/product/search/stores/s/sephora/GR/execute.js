
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'sephora',
    domain: 'sephora.gr',
    url: 'https://www.sephora.gr/en/search?search_query={searchTerms}',
    loadedSelector: 'div#columns',
    noResultsXPath: '//div[@id="columns"]/div[@class="row"]/div[contains(@class,"no-results")]',
    zipcode: '',
  },
};
