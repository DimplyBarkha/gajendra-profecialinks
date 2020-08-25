
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GB',
    store: 'boots',
    nextLinkSelector: 'button[class="results-btn-viewmore"]',
    mutationSelector: 'ul[class="grid_mode grid"]',
    domain: 'boots.com',
    zipcode: '',
  },
};
