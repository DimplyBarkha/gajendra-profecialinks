module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'villatech',
    domain: 'villatech.fr',
    loadedSelector: "div[class*='item'] , article[class='product']",
    noResultsXPath: "//div[contains(@class,'alert-info') and contains(.,'Aucun résultat trouvé')]",
    zipcode: '',
  },
};
