
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    nextLinkSelector: '.pagination li a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-list-col"] article',
    noResultsXPath: "//div[@class='alert alert-info' and contains(.,'Aucun résultat trouvé')]",
    openSearchDefinition: null,
    domain: 'pulsat.fr',
    zipcode: '',
  },
};
