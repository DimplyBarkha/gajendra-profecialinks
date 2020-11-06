
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.whisky.de/shop/index.php?cl=search&searchparam=%22Can%22',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
