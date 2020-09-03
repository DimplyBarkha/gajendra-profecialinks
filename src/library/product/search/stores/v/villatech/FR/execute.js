
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'villatech',
    domain: 'villatech.fr',
    url: 'https://www.villatech.fr/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'section.products-list div.product-list-col',
    noResultsXPath: '//div[@class="results"]//div[contains(text(),"Aucun résultat trouvé")]',
    zipcode: '',
  },
};
