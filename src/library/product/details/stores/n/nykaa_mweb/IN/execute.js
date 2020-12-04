
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa_mweb',
    domain: 'nykaa.com',
    loadedSelector: 'div[class*=product-description] div.pd-main-image',
    noResultsXPath: '//p[@class="sorry-text"]',
    zipcode: "''",
  },
};
