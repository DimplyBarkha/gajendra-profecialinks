
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'ag_parfetts',
    domain: 'online.parfetts.co.uk',
    url: 'https://online.parfetts.co.uk/search?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="main-column"]//h2[@class="font-weight-bold"]',
    zipcode: '',
  },
};
