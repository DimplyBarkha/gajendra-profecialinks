
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    loadedSelector: 'div.product-review.clearfix',
    noResultsXPath: '//h1[@class="notfound-title"]',
  },
};
