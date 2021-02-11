
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'zooplus',
    domain: 'zooplus.fr',
    loadedSelector: null,
    // noResultsXPath: "//span[@class='exo-noResults']",
    noResultsXPath: "//div[@class='middle']//div[contains(.,'Nous n’avons trouvé aucune correspondance pour')]",
    zipcode: '',
  },
};
