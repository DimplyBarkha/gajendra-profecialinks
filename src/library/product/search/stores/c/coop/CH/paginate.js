
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'coop',
    nextLinkSelector: 'a.list-page__trigger.list-page__trigger--inactive',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'ul.list-page__content li',
    noResultsXPath: '//h1[contains(text(),"Aucun résultat trouvé")]',
    // openSearchDefinition: null,
    domain: 'coop.ch',
    zipcode: "''",
  },
};
