module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    nextLinkSelector: 'li.sc-pagination-next button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.sc-plp-layout',
    openSearchDefinition: null,
    domain: 'samsclub.com',
  },
};
