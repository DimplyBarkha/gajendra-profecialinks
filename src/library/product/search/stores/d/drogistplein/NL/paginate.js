
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'drogistplein',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(text(),"Probeer eens een merknaam of beschrijving van je product in te typen.")]',
    openSearchDefinition: null,
    domain: 'drogistplein.nl',
    zipcode: "''",
  },
};