
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'boots',
    nextLinkSelector: 'button.results-btn-viewmore:not([disabled])',
    mutationSelector: 'ul[class="grid_mode grid"]',
    domain: 'boots.ie',
    zipcode: '',
  },
};
