
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    nextLinkSelector: null,
    mutationSelector: 'ul[class="grid_mode grid"]',
    domain: 'boots.com',
    zipcode: '',
  },
};
