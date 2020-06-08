
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    openSearchDefinition: {
      pageOffset: 500,
      template: 'https://api.empathybroker.com/search/v1/query/douglas/search?lang=es&origin=linked&promoted.start={page}&scope=desktop&start=0&rows=500&tariff=V005&q={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'douglas.es',
  },
};
