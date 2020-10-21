
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'danube',
    // nextLinkSelector: 'li.ais-pagination--item__next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ais-hits--item',
    noResultsXPath: '//div[contains(@class,"ais-hits__empty")]',
    domain: 'danube.sa',
    openSearchDefinition: {
      template: 'https://www.danube.sa/en/search?query={searchTerms}&page={page}&ItemPerPage=20',
    },
    zipcode: '',
  },
};
