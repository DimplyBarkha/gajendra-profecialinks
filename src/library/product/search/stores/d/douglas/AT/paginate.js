
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td[class="code depth_1"]',
    noResultsXPath: null, 
    openSearchDefinition: {
      pageOffset: -1,
      template: 'https://www.douglas.at/jsapi/v2/products/search?currentPage={page}&pageSize=50&query={searchTerms}&fields=FULL&crealyticsSpaEnabled=true#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'douglas.at',
    zipcode: '',
  },
};
