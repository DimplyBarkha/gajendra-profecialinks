
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.whisky.de/shop/index.php?cl=search&pgNr=0&searchparam={searchTerms}&searchorigin=1&_artperpage=150',
    loadedSelector:'div[id=article-filter-container]',
    noResultsXPath: null,
    zipcode: '',
  },
};