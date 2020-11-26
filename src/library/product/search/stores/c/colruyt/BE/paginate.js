
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    nextLinkSelector: 'button[class*="pagination__next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.card__image',
    noResultsXPath: '//div[contains(@class,"assortment-overview__sorting")]//font[contains(text(),"0 products")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.colruyt.be/fr/produits?page={page}&searchTerm={searchTerms}',
    // },
    domain: 'colruyt.be',
    zipcode: '',
  },
};
