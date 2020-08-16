
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="content"]',
    openSearchDefinition: {
      template: 'https://www.flaconi.de/search/?q={searchTerms}',
    },
    domain: 'flaconi.de',
  },
};
