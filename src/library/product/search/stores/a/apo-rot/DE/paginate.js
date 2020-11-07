
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'apo-rot',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products',
    noResultsXPath: '//div[@data-blockinfo="nosearch_loopwasempty"]//p',
    openSearchDefinition: null,
    domain: 'apo-rot.de',
    zipcode: "''",
  },
};
