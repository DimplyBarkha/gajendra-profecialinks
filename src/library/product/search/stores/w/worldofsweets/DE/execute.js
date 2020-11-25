
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    domain: 'worldofsweets.de',
    url: 'https://www.worldofsweets.de/index.php?cl=fcfatsearch_productlist&searchparam=<SEARCH_TERM>',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
