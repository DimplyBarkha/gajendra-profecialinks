
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'shipt_meijer',
    domain: 'shop.shipt.com',
    loadedSelector: 'div[data-test=ProductDetail-container]',
    noResultsXPath: '//div[@data-test="ErrorPage-message"]',
    zipcode: "''",
  },
};
