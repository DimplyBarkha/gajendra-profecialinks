
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'coursesu',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-image img',
    noResultsXPath: '//h2/@data-su-analytics-search-error',
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.coursesu.com/recherche?q={searchTerms}&lang=fr_FR&page={page}',
    // },
    openSearchDefinition: null,
    domain: 'coursesu.com',
    zipcode: '76120',
  },
};
