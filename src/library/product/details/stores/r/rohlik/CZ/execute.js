
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CZ',
    store: 'rohlik',
    domain: 'rohlik.cz',
    loadedSelector: 'img[loading="lazy"]',
    noResultsXPath: '//div[@class="Error__error"]//div[contains(.,"Návrat na úvodní stránku")]',
    zipcode: '',
  },
};
