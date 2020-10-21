
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SA',
    store: 'danube',
    domain: 'danube.sa',
    loadedSelector: 'div.product-show__wrapper',
    noResultsXPath: '//div[@class="not-found__inner"]/h1[contains(text(), "Error 404")]',
    zipcode: '',
  },
};
