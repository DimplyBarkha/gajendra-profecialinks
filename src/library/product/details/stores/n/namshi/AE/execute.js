
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    domain: 'namshi.com',
    loadedSelector: 'div#product_carousel',
    noResultsXPath: '//h2[contains(text(),"وصلنا حديثا")]',
    zipcode: "''",
  },
};
