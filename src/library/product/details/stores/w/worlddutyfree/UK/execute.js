
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    domain: 'worlddutyfree.com',
    loadedSelector: "div[class='fieldset'] div[class='flags'] span[class *= 'stock-status']",
    noResultsXPath: '//div[@class="cms-404-page-text column"]/h2',
    zipcode: '',
  },
};
