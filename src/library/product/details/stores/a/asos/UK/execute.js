module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    domain: 'asos.com',
    loadedSelector: '#asos-product',
    noResultsXPath: '//section[@class="grid-text__container"]//h2',
    zipcode: '',
  },
};