
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'EG',
    store: 'souq',
    nextLinkSelector: 'li[class="pagination-next goToPage"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="tpl-results"]',
    noResultsXPath: '//div[contains(@class , "zero-results")]',
    openSearchDefinition: null,
    domain: 'egypt.souq.com',
    zipcode: '',
  },
};
