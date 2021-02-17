
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'hagel-shop',
    domain: 'hagel-shop.de',
    url: 'https://www.hagel-shop.de/catalogsearch/result?q={searchTerms}',
    loadedSelector: 'div.category-products>div.row>ul.products-grid.thumbnails>li div.visible',
    // noResultsXPath: '//p[@class="note-msg"]',
    zipcode: '',
  },
};
