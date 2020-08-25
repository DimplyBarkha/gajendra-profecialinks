
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    domain: 'pulsat.fr',
    loadedSelector: 'article[class="product"]',
    noResultsXPath: "//div[contains(@class,'alert alert-info') and contains(.,'Aucun résultat trouvé')]",
    zipcode: '',
  },
};
