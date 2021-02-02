
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    nextLinkSelector: 'a[data-ga-label="Search Results-Pagination-Next-Link"]',
    loadedSelector: 'body',
    domain: 'allbeauty.com',
    zipcode: '',
  },
};
