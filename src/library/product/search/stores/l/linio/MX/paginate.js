
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    nextLinkSelector: 'ul li[class*=page-item]:nth-last-child(2) a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[itemtype*="http://schema.org/Product"]',
    loadedXpath: '//div[contains(@id,"catalogue-product-container")]',
    noResultsXPath: '//div[contains(@class,"text-content secondary-text")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'linio.com.mx',
    zipcode: '',
  },
};
