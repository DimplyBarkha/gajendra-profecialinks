
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    domain: 'komus.ru',
    loadedSelector: 'div[class="b-content b-content--main"]',
    noResultsXPath: 'p[class="b-contentTitle b-contentTitle--search"]',
    zipcode: '',
  },
};
