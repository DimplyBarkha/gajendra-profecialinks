
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    openSearchDefinition: {
      pageOffset: 24,
      template: 'https://api.empathybroker.com/search/v1/query/douglas/search?lang=es&origin=linked&promoted.start=0&scope=desktop&start={page}&rows=24&tariff=V005&q={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'douglas.es',
    zipcode: '',
  },
};
