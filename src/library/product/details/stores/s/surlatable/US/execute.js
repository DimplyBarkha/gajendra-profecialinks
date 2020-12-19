
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'surlatable',
    domain: 'surlatable.com',
    loadedSelector: '#pdpMain',
    noResultsXPath: '//body[contains(text(),"Invalid URL. Please continue by going to our")] | //div[contains(@class, "notfound-error-page")]',
    zipcode: "''",
  },
};
