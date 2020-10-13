
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    domain: 'ocado.com',
    loadedSelector: 'div[class*="bop-gallery__item--chosen"] img',
    noResultsXPath: '//div[@class="nf-resourceNotFound"]',
    zipcode: '',
  },
};
