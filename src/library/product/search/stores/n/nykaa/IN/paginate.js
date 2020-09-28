
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    loadedSelector: 'td.dynamic_tags',
    openSearchDefinition: {
      indexOffset: 20,
      template: 'https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from={offset}&search={searchTerms}&source=react#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'nykaa.com',
  },
};
