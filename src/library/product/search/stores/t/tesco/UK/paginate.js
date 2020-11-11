module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    spinnerSelector: 'div.loading-spa',
    loadedSelector: 'li.product-list--list-item:nth-last-child(1) div[class*="product-image__container"] > img',
    nextLinkSelector: 'nav.pagination--page-selector-wrapper > ul > li:last-child > a.pagination--button.prev-next:not(.disabled)',
    domain: 'tesco.com',
  },
};
