
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(), "There are no results for")]',
    openSearchDefinition: {
      template: "https://www.jumia.com.eg/catalog/?q={searchTearms}&page={page}",
      pageOffset: 1,
    },
    domain: 'jumia.com.eg',
    zipcode: '',
  },
};
