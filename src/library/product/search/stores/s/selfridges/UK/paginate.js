
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.composite-products_list',
    noResultsXPath: '//p[contains(text(), "We can\'t seem to find any results")]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.selfridges.com/US/en/cat/?freeText={searchTerms}&pn={page}',
      pageOffset: 0,
      pageStartNb: 1,
    },
    domain: 'selfridges.uk',
    zipcode: "''",
  },
};
