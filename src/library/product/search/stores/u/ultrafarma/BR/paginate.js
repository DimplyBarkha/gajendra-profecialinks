
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BR',
    store: 'ultrafarma',
    nextLinkSelector: 'ul.pagination.pagination-vitrine li:nth-child(2)',
    loadedSelector: 'div#container',
    noResultsXPath: '//section[contains(@class,"erros")]//p[contains(text(),"Nenhum resultado encontrado para")]',
    domain: 'ultrafarma.com.br',
    zipcode: "''",
  },
};
