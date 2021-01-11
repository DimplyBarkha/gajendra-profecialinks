
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'http://www.whisky.de/shop/index.php?lang=0&cl=search&searchparam={searchTerms}',
    loadedSelector:null,
    noResultsXPath: null,
    zipcode: '',
  },
};
