module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'beru.ru',
    loadedSelector: 'div[data-apiary-widget-name="@marketplace/SkuSummary"]',
    noResultsXPath: '//div[@data-zone-name="FatalError"]',
    zipcode: '',
  },
};
