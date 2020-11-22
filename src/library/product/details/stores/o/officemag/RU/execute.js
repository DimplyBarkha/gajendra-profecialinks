
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    domain: 'officemag.ru',
    loadedSelector: 'div[class="tabsContent__item delivery"]',
    noResultsXPath: '//div[@class="junctionInfo junctionInfo--notFound"]',
    zipcode: '',
  },
};
