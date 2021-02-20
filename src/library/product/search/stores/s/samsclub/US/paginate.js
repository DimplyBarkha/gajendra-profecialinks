module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    //nextLinkSelector: 'div.sc-pagination-control ol li.sc-pagination-next button' ,
    //mutationSelector: null,
    //spinnerSelector: null,
    //loadedSelector: 'div.sc-plp-layout',
    //openSearchDefinition: null,
    openSearchDefinition: {
      offset: 48,
      template: 'https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=1&sortKey=relevance&sortOrder=1&limit=48&searchTerm={searchTerms}&clubId=6384&br=true&offset={offset}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'samsclub.com',
  },
};
