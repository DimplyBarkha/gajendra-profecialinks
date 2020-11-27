
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'williams-sonoma',
    domain: 'williams-sonoma.com',
    loadedSelector: 'div.purchasing-container',
    noResultsXPath: "//span[@id='intersectionWrapper_']",
    zipcode: '',
  },
};
