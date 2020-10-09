
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'Intermarche',
    domain: 'intermarche.com',
<<<<<<< HEAD
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: ''
=======
    loadedSelector: '[class^="product-price--unit ProductPrice__PriceUnit"]',
    noResultsXPath: '//*[@id="go_home"]',
    zipcode: '',
>>>>>>> 12d6f448e4bc65d2f9067f9437005f7323456fff
  },
};
