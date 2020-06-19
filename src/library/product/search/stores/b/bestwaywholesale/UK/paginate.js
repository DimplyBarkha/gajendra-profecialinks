
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    nextLinkSelector: 'ul > li.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#shop-products > li',
    domain: 'bestwaywholesale.co.uk',
  },
};
