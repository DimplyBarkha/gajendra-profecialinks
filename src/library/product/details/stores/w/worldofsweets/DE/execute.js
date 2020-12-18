
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    domain: 'worldofsweets.de',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'content is--fixed')]//div//div/p/text()",
    zipcode: "''",
  },
};
