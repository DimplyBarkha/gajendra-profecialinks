module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    nextLinkSelector: 'li.sc-pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#panel-all-id div ul',
    openSearchDefinition: null,
    domain: 'samsclub.com',
  },
};
