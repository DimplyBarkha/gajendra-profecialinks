
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'datart',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div #fulltext-results , #products-list',
    noResultsXPath: null,
    // openSearchDefinition : null,
    openSearchDefinition: {
      template: 'https://www.datart.cz/vyhledavani/index.html?q={searchTerms}&page={page}',
    },
    domain: 'datart.cz',
    zipcode: '',
  },
};

// module.exports = {
//   implements: 'navigation/paginate',
//   parameterValues: {
//     template: null,
//     country: 'CZ',
//     store: 'datart',
//     nextLinkSelector: null,
//     nextPageUrlSelector: null,
//     nextLinkXpath: null,
//     mutationSelector: null,
//     spinnerSelector: null,
//     loadedSelector: null,
//     loadedXpath: null,
//     noResultsXPath: null,
//     stopConditionSelectorOrXpath: null,
//     resultsDivSelector: null,
//     openSearchDefinition: null,
//     domain: 'datart.cz',
//     zipcode: '',
//   },
// };
