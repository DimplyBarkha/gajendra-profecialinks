
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    domain: 'alza.cz',
    url: 'https://www.alza.cz/search.htm?exps={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@id="noresult"]',
    zipcode: '',
  },
};
