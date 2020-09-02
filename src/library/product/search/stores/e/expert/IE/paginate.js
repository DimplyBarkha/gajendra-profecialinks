
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-item-info',
    noResultsXPath: '//*[contains(text(), "no results")]',
    openSearchDefinition: {
      template: 'https://www.expert.ie/catalogsearch/result/index/?p={page}&q={searchTerms}'
    },
    domain: 'expert.ie',
    zipcode: '',
  },
};
