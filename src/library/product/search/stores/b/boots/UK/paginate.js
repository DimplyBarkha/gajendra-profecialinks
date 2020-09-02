
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    nextLinkSelector: 'button.results-btn-viewmore:not([disabled])',
    mutationSelector: 'ul[class="grid_mode grid"]',
    domain: 'boots.com',
    zipcode: '',
  },
};
