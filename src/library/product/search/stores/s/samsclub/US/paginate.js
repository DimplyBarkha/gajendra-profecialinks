module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.sc-plp-layout',
    openSearchDefinition: null,
    domain: 'samsclub.com',
  },
};
