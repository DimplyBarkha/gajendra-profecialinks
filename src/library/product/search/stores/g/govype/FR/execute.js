
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'govype',
    domain: 'govype.com',
    url: 'https://www.govype.com/fr/fr/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.search.results',
    noResultsXPath: '//div[@class="message notice"]//div[contains(text(),"donné aucun résultat.")]',
    zipcode: "''",
  },
};
