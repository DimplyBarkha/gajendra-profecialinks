
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    domain: 'iga.net',
    url: 'https://www.iga.net/search?t={D9CE4CBE-C8C3-4203-A58B-7CF7B830880E}&k={searchTerms}',
    loadedSelector: null,
    noResultsXPath: "//h2[contains(@class,'h3-like')]/parent::div[@class='grid__item']",
    zipcode: '',
  },
};
