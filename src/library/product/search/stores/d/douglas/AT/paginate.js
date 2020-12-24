
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null, 
    openSearchDefinition: {
      template: 'https://www.douglas.at/jsapi/v2/products/search?currentPage={page}&pageSize=180&query={searchTerms}&fields=FULL&crealyticsSpaEnabled=true#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'douglas.at',
    zipcode: '',
  },
};
