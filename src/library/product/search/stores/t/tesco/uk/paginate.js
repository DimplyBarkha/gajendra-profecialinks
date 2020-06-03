
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'uk',
    store: 'tesco',
    spinnerSelector: 'div.loading-spa',
    loadedSelector: 'div.product-image__container',
    nextLinkSelector: 'nav.pagination--page-selector-wrapper > ul > li:last-child > a.pagination--button.prev-next:not(.disabled)',
    domain: 'tesco.com',
  },
};
