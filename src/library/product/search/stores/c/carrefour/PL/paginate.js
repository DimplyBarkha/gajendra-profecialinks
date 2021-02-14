
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'carrefour',
    nextLinkSelector: 'button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorPrimary:nth-of-type(2) span',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#__next header + div + div>div',
    noResultsXPath: null,
    resultsDivSelector: null,
    // openSearchDefinition: null,
    // openSearchDefinition: {
    //   // offset: 60,
    //   pageStartNb:0,
    //   template: 'https://www.carrefour.pl/szukaj?q={searchTerms}&page={page}',
    // },
    domain: 'carrefour.pl',
    zipcode: '',
  },
};
