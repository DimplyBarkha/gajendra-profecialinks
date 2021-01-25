
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.whisky.de/shop/index.php?cl=search&searchparam={searchTerms}&searchorigin=0',
    loadedSelector:'div[id=article-filter-container]',
    noResultsXPath: null,
    zipcode: '',
  },
};