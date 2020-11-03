
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    nextLinkSelector: 'a.responsive-pagination__pager--next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.productList__itemImage.js-productListImage',
    noResultsXPath: '//div[contains(@class, "hasNoSearchResults js-hasNoSearchResults")]',
    openSearchDefinition: null,
    domain: 'brack.ch',
    zipcode: '',
  },
};
