
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    domain: 'officemag.ru',
    loadedSelector: 'div[class="itemInfoDetails group"]',
    noResultsXPath: '//div[@class="junctionInfo junctionInfo--notFound"]',
    zipcode: '',
  },
};
