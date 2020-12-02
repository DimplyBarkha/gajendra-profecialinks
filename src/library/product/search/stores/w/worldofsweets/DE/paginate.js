
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',    
    nextLinkSelector: 'div.product.is--next>div>a,div.list-options-pagination>ol#itemsPagertop>li.next>a,div.list-options-pagination>ol#itemsPagerbottom>li.next>a',
    mutationSelector: null,
    spinnerSelector: null,   
    loadedSelector: 'div.product-picture>a',
    noResultsXPath: '//div[@class="content is--fixed"]//a',
    openSearchDefinition: null,
    domain: 'worldofsweets.de',
    zipcode: '',
  },
};
