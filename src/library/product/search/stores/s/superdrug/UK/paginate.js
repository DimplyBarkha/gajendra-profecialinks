
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    nextLinkSelector: 'li.next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[class="bv-off-screen"]',
    openSearchDefinition: null,
    domain: 'superdrug.com',
  },
};
