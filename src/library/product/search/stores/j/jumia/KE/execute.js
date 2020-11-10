
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    domain: 'jumia.co.ke',
    url: 'https://www.jumia.co.ke/catalog/?q={searchTerms}',
    loadedSelector: 'section.card',
    noResultsXPath: '//h2[contains(text(), "There are no results for")]',
    zipcode: '',
  },
};
