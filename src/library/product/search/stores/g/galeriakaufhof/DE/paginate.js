
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'galeriakaufhof',
    nextLinkSelector: 'a[class="page-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.galeria.de/search?q=shampoo#q={searchTerms}&start={page}&sz=36',
    // },
    domain: 'galeria.de',
    zipcode: '',
  },
};
