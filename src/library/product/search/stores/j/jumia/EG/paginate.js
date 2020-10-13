
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//h2[contains(@class,'-pvs')]",
    openSearchDefinition: {
      template: "https://www.jumia.com.eg/catalog/?q={searchTearms}&page={page}",
      page: 1,
    },
    domain: 'jumia.com.eg',
    zipcode: '',
  },
};
