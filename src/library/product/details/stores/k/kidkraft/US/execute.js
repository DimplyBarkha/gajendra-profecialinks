
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kidkraft',
    domain: 'kidkraft.com',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'message notice')]//div/text()",
    zipcode: "''",
  },
};
