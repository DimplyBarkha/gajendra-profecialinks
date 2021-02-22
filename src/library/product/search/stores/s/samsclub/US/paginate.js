module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    //nextLinkSelector: 'div.sc-pagination-control ol li.sc-pagination-next button' ,
    //mutationSelector: null,
    //spinnerSelector: null,
    loadedSelector: 'td.records',
    //openSearchDefinition: null,
    openSearchDefinition: {
      pageOffset : 48,
      pageStartNb: 0,
      template: 'https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=1&sortKey=relevance&sortOrder=1&offset={page}&limit=48&searchTerm={searchTerms}&clubId=6617&br=true#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'samsclub.com',
  },
};
