module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    domain: 'newpharma.be',
    url: 'https://www.newpharma.be/pharmacie/search-results/index.html?key1={searchTerms}',
    loadedSelector: 'div.product.js-product-row img',
    noResultsXPath: '//span[@class="gtm-search-no-results"]',
    zipcode: "''",
  },
};
