
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    nextLinkSelector: 'li[class*=page-item]:nth-last-child(2) a',
    nextLinkXpath: '//li[contains(@class,"page-item") and (position()>=2 and position() = (last() - 1))]//a',
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
