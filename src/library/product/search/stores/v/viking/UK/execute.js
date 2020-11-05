
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'viking',
    domain: 'viking-direct.co.uk',
    url: 'https://www.viking-direct.co.uk/en/search/?text={searchTerms}',
    loadedSelector: 'main#siteContent',
    noResultsXPath: '//div[@id="searchEmpty"]',
    zipcode: '',
  },
};
