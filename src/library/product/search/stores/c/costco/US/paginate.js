
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco',
    nextLinkSelector: 'li.forward > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-list.grid',
    openSearchDefinition: null,
    domain: 'costco.com',
  },
};
