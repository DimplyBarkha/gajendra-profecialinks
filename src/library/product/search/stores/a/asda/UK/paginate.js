module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    nextLinkSelector: 'button[aria-label="next page"] > span:not(.asda-icon--gray)',
    spinnerSelector: 'div.search-page-content div.asda-spinner',
    loadedSelector: 'div.search-page-content__products-tab-content li.co-item:nth-last-child(1) div.co-product img',
    domain: 'groceries.asda.com',
  },
};
