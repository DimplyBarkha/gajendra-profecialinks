
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    domain: 'carrefouruae.com',
    loadedSelector: 'h1.css-17yb6kp',
    noResultsXPath: "//h2[contains(text(),'Sorry! The page you're looking for does not exist')]",
    zipcode: '',
  },
};
