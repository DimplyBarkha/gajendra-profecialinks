
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'impo',
    nextLinkSelector: 'list-page__trigger__text',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li.list-page__item',
    openSearchDefinition: null,
    domain: 'impo.ch',
  },
};
