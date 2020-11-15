
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'sweetcare',
    domain: 'sweetcare.pt',
    url: 'https://www.sweetcare.pt/search.aspx?q={searchTerms}',
    loadedSelector: 'ul#searchItems',
    noResultsXPath: "//b[contains(text(),'Não encontra o produto')]",
    zipcode: '',
  },
};
