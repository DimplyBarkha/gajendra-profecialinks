
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vapordna',
    domain: 'vapordna.com',
    url: 'https://vapordna.com/search?type=product&q={searchTerms}',
    loadedSelector: 'div.ais-hits-container.ais-results-as-block',
    noResultsXPath: '//div[@class="ais-hit-empty--title"]',
    zipcode: "''",
  },
};
