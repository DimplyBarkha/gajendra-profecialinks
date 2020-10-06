
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'jbhifi',
    domain: 'jbhifi.co.nz',
    loadedSelector: "div[class*='gallery'] div[class='image'] img",
    noResultsXPath: "//div[contains(@class,'block')]",
    zipcode: '',
  },
};
