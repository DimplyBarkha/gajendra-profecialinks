
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://at.whisky.de/shop/index.php?cl=search&searchparam=%22Rum%22&searchorigin=1&_artperpage=10&pgNr=0',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
