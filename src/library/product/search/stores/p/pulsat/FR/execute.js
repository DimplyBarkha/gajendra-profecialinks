
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    domain: 'pulsat.fr',
    url: 'https://www.pulsat.fr/catalogsearch/result/index?N=1&q={searchTerms}',
    loadedSelector: 'div[class*="product-list-col"] article',
    noResultsXPath: "//div[@class='alert alert-info' and contains(.,'Aucun résultat trouvé')]",
    zipcode: '',
  },
};
