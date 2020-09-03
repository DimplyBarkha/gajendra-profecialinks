module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    domain: 'appliancesonline.com.au',
    nextLinkSelector: null,
    //nextLinkSelector: 'div.pagination > pagination-template > ul > li.ng-star-inserted:not([class*="active"]):last-child > a.ng-star-inserted',
    loadedSelector: 'div.grid-container-flex',
    openSearchDefinition: {
      template: 'https://www.appliancesonline.com.au/search/{searchTerms}?currentpage={page}&sortkey=highestrated',
    },
  },
};
