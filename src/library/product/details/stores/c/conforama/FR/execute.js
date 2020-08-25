
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    domain: 'conforama.fr',
    loadedSelector: 'div[id="main"]',
    noResultsXPath: '//div[@class="errorContent1"]',
    zipcode: '',
  },
};
