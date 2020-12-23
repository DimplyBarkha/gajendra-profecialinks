
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
      indexOffset: 20,
      template: 'https://www.douglas.at/jsapi/v2/products/search?currentPage={offset}&pageSize=48&query={searchTerms}&fields=FULL&crealyticsSpaEnabled=true#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'douglas.at',
    zipcode: '',
  },
};
