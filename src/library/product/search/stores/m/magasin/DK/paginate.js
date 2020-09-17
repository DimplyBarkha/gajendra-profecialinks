
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    nextLinkSelector: 'div.show-more > div.load-more > button[class="button -border"]',
    loadedSelector: 'div.product-list__grid',
    noResultsXPath: '//div.search-no-results',      
    domain: 'magasin.dk',
    zipcode: '',
  },
};
