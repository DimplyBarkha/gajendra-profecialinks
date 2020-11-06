
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.whisky.de/shop/index.php?stoken=7DA02FBC&lang=0&cl=search&searchparam={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
