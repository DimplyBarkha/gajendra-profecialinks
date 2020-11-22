
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    nextLinkSelector: 'button.results-btn-viewmore',
    mutationSelector: null,
    domain: 'boots.com',
    zipcode: '',
  },
};
