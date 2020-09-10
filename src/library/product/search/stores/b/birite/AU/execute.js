
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'birite',
    domain: 'birite.com.au',
    url: 'https://www.birite.com.au/?s={searchTerms}&post_type=product',
    loadedSelector: 'ul.products',
    noResultsXPath: '//P[@class="woocommerce-info"]'
  },
};

