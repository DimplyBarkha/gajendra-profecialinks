
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    domain: 'douglas.es',
    url: 'https://api.empathybroker.com/search/v1/query/douglas/search?lang=es&origin=linked&promoted.start=0&scope=desktop&tariff=V005&start=0&rows=150&q={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
  },
};
