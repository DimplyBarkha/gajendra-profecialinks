
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco',
    nextLinkSelector: 'div.paging ul li.forward>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.thumbnail p.description',
    openSearchDefinition: null,
    domain: 'costco.com',
  },
};
