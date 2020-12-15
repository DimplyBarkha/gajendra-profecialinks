
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"txt_c noResults mrg_b_xlg")]',
    openSearchDefinition: {
      template:'https://www.fnac.com/SearchResult/ResultList.aspx?Search={searchTerms}&PageIndex={page}',
    },
    domain: 'fnac.fr',
    zipcode: "''",
  },
};
