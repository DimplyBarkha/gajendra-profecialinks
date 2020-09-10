
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    domain: 'magasin.dk',
    url: 'https://www.magasin.dk/soegning?q={searchTerms}&simplesearch=',
    loadedSelector: 'div.searchcontainer',
    noResultsXPath: '//div[@class="page-header page-header--no-margin-bottom"]',
  },
};
