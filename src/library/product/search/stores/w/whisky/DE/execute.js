
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.whisky.de/shop/index.php?cl=search&searchparam=Cognac',
    loadedSelector:'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
