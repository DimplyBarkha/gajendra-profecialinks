
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'boots',
    nextLinkSelector: 'button[class="results-btn-viewmore"]',
    mutationSelector: 'ul[class="grid_mode grid"]',
    domain: 'boots.ie',
    zipcode: '',
  },
};
