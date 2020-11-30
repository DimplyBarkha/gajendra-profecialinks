
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'lentillesmoinscheres',
    domain: 'lentillesmoinscheres.com',
    url: 'https://www.lentillesmoinscheres.com/category.php?search_text={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
