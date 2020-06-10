
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'waitrose',
    domain: 'waitrose.com',
    url: 'https://www.waitrose.com/ecom/shop/search?&searchTerm={searchTerms}',
    loadedSelector: 'picture[class="productPod___3mbxG podImage___1ajLe"]',
    noResultsXPath: '//h1[contains(@class,"title___3K4ea")]',
  },
};
