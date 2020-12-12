
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    nextLinkSelector: '.pageControl ul li:last-child a[href]',
    mutationSelector: null,
    domain: 'boots.com',
    zipcode: '',
  },
};
