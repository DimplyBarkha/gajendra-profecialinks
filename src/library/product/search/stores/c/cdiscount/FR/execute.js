
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    domain: 'cdiscount.fr',
    url: 'https://www.cdiscount.com/search/10/{searchTerms}.html',
    loadedSelector: 'ul[id="lpBloc"]',
    noResultsXPath: '//*[@class="lrTryAgain"]',
    zipcode: "''",
  },
};
