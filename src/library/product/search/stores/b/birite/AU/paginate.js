
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'birite',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.products',
    openSearchDefinition: null,
    domain: 'birite.com.au',
    zipcode: '',
  },
};
