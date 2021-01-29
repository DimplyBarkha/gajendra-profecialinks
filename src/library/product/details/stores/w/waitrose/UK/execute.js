module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"]',
    noResultsXPath: '//nav[@data-test="shop-windows"] | //div[@class="noResults___2M4HP"] | //h1[contains(text(), "404 Not Found")] | //ul[@style="margin-left:1.3em;margin-bottom:2em"] | //h1[contains(text(), "Offer(s)")] | //h1[@class="problem___1gdZ-"] | //pdf-viewer | //body[contains(text(), "PDF")]',
    zipcode: '',
  },
};
