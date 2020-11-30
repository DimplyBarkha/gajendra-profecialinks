
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'procurator',
    nextLinkSelector: 'ul.pagination li.hide-for-small a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a.item-box-image img',
    noResultsXPath: '//h2[text()="Tyvärr så gav din sökning på "Anil" inga träffar."]',
    openSearchDefinition: null,
    domain: 'procurator.net',
    zipcode: '',
  },
};
