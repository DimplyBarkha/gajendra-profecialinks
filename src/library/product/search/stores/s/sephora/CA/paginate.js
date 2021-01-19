
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    nextLinkSelector: 'button[aria-label="Next"].css-1lkjxdl, eanm77i0',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.css-1bvyrmg, e65zztl0',
    noResultsXPath: '//h1[contains(@class,"css-1wag3se") and contains(@class,"e65zztl0") and contains(text(),"0 Product results:")]',
    openSearchDefinition: null,
    domain: 'sephora.com',
    zipcode: '',
  },
};
