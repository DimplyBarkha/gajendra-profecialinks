
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://at.whisky.de/shop/index.php?cl=search&searchparam={searchterms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
