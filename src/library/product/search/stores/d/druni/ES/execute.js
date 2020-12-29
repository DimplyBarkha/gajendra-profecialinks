
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'druni',
    domain: 'druni.es',
    url: 'https://www.druni.es/#/dfclassic/query={searchTerms}',
    // loadedSelector: null,
    // noResultsXPath: null,
    loadedSelector: 'figure img',
    noResultsXPath: '//div[contains(@class,"results")]//p[contains(@class,"no-results")]',
    zipcode: "''",
  },
};
