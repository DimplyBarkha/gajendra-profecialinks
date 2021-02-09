module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GB',
    domain: 'groceries.asda.com',
    store: 'asda',
    nextLinkSelector: 'button[aria-label="next page"] > span:not(.asda-icon--gray)',
    spinnerSelector: 'div.search-page-content div.asda-spinner',
  },
};
