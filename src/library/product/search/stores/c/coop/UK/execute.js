
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    domain: 'coop.co.uk',
    url: 'https://www.coop.co.uk/products/search?query={searchTerms}',
    loadedSelector: 'div.ais-results article',
    noResultsXPath: '//div[@class="ais-index" and not(.//div[contains(@class,"ais-results")])]',
    zipcode: "''",
  },
};
