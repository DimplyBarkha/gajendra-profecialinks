
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kidkraft',
    domain: 'kidkraft.com',
    loadedSelector: 'div.page-wrapper',
    noResultsXPath: "//div[contains(@class,'message notice')]//div/text()",
    zipcode: "''",
  },
};
