
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    nextLinkSelector: 'a#body_0_main_1_GrocerySearch_TemplateResult_PaginationTop_NextPageBtn',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//h2[contains(@class,'h3-like')]/parent::div[@class='grid__item']",
    openSearchDefinition: null,
    domain: 'iga.net',
    zipcode: '',
  },
};
