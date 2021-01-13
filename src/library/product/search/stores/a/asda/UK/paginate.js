
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    openSearchDefinition: {
      template: 'https://groceries.asda.com/api/items/search?productperpage=60&pagenum={page}&keyword={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'groceries.asda.com',
  },
};
