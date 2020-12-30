
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"], a[data-origincomponent="ProductPod"]',
    noResultsXPath: '//button[@aria-label="Load more"] | //div[@class="noResults___2M4HP"] | //h1[contains(text(), "404 Not Found")]',
    zipcode: '',
  },
};
