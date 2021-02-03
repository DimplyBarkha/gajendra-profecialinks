
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    domain: 'komus.ru',
    loadedSelector: 'div[id="bContainerMain"]',
    noResultsXPath: '//div[@class="content-double-column i-mb45"]',
    zipcode: '',
  },
};
