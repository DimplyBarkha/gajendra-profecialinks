
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    mutationSelector: null,
    // nextLinkSelector: 'ul.pagination>li.active+li>a',
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-view-container"]',
    noResultsXPath: '//div[contains(text(),"Probeer eens een merknaam of beschrijving van je product in te typen.")]',
    openSearchDefinition: {
      template: 'https://www.plein.nl/zoeken?search={searchTerms}&p={page}',
    },
    domain: 'plein.nl',
    zipcode: "''",
  },
};
