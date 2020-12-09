
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    domain: 'eapteka.ru',
    loadedSelector: 'div.offer-card',
    noResultsXPath: '//div[@class="sec-error"]',
    zipcode: '',
  },
};
