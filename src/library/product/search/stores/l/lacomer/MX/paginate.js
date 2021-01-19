
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    // nextLinkSelector: 'button[class="btn btn-primary hidden-sm-down"]',
    // nextLinkXpath: '//button[@ng-click="buscaxPaginaSig(pagActual)"][2]',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'div[class="li_prod_picture"]',
    loadedXpath: null,
    noResultsXPath: null,
    // stopConditionSelectorOrXpath: '//html//div[@id="noResults"]',
    resultsDivSelector: null,
    openSearchDefinition: {
      // pageStartNb: 2,
      template: 'https://lacomer.buscador.amarello.com.mx/searchArtPrior?col=lacomer_2&npagel=20&orden=-1&p={page}&patrocinados=false&s={searchTerms}&succId=14#[!opt!]{"type":"json"}[/!opt!]',
      },
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
};
