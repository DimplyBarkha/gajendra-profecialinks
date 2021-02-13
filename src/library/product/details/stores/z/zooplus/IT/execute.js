
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'zooplus',
    domain: 'zooplus.it',
    loadedSelector: '//*[contains(@class,"producttitle")]',
    noResultsXPath: '//*[contains(@class,"pagetitle__info exo-noResults")][not(//*[contains(@id,"exo-result-list")]//*[contains(@class,"exo-result")])]',
    zipcode: '',
  },
};
