
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.whisky.de/shop/index.php?cl=search&searchparam={searchTerms}&_artperpage=150',
    loadedSelector:'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
