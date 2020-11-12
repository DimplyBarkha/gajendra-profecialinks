
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"], a[data-origincomponent="ProductPod"]',
    noResultsXPath: '//h1[@class="problem___1gdZ-"]',
    zipcode: '',
  },
};
