
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    domain: 'ao.com',
    url: "https://ao.com/l/search/101/99/?search='{searchTerms}'",
    loadedSelector: 'main.lister',
    noResultsXPath: 'div.no-results ',
    zipcode: '',
  },
};
