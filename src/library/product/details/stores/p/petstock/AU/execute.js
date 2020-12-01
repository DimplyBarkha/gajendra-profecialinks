
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'petstock',
    domain: 'petstock.com.au',
    loadedSelector: 'div[itemprop="product"]',
    noResultsXPath: '//div[@class="container"]//h1[@class="h2"][contains(text(),"Whoops")]',
    zipcode: '',
  },
};
