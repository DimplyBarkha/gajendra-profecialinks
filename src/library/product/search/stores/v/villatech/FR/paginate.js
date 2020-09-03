
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'villatech',
    nextLinkSelector: 'a[title="Page suivante"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.products-list div.product-list-col',
    noResultsXPath: '//div[@class="results"]//div[contains(text(),"Aucun résultat trouvé")]',
    openSearchDefinition: null,
    domain: 'villatech.fr',
    zipcode: '',
  },
};
