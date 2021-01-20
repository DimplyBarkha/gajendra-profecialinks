
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    domain: 'staples.ca',
    url: 'https://www.staples.ca/search?query={searchTerms}',
    loadedSelector: 'div.ais-results-as-block',
    noResultsXPath: '//div[@class="ais-hit-empty"]//li[contains(text(),"Try different keywords")]',
    zipcode: "''",
  },
};
