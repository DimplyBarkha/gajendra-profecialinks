
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    nextLinkSelector: 'div[class="pager-bottom"] a[class="pagination-next"]',
    mutationSelector: 'span[class="goods-count j-goods-count"]',
    spinnerSelector: null,
    loadedSelector: 'div[class="catalog_main_table j-products-container"]',
    noResultsXPath: '//p[contains(@class,"searching-results-text")]',
    domain: 'wildberries.ru',
    zipcode: '',
  },
};
