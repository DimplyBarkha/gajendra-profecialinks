
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    domain: 'worldofsweets.de',
    url: 'https://www.worldofsweets.de/index.php?cl=fcfatsearch_productlist&searchparam={searchTerms}',
    loadedSelector: 'div.product-picture>a',
    noResultsXPath: '//div[@class="content is--fixed"]//a',
    zipcode: '',
  },
};
