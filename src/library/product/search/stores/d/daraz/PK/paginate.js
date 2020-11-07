
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PK',
    store: 'daraz',
    nextLinkSelector: 'li.ant-pagination-next a.ant-pagination-item-link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-qa-locator="product-item"]',
    noResultsXPath: '//div[contains(text(),"Search No Result")]',
    openSearchDefinition: null,
    domain: 'daraz.pk',
    zipcode: "''",
  },
};
