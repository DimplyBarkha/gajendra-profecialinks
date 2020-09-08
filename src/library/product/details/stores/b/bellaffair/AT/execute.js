
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    domain: 'bellaffair.at',
    loadedSelector: 'html',
    noResultsXPath: '//div[@class="column-two clear"]',
    zipcode: '',
  },
};