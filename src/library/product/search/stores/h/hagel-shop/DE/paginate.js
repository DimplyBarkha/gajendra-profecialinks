
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'hagel-shop',
    nextLinkSelector: 'div[class="toolbar bottom"] li a[class="button next"]',
    // 'body > div.wrapper > div.main-container.case > div > div.main > article > div.search-result > div.category-products > div.toolbar.bottom > div > div > ul > li:last-child > a[class="button next"]',
    // div[class="toolbar bottom"] li a[class="button next"]
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'hagel-shop.de',
    zipcode: '',
  },
};
