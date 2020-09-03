module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    domain: 'appliancesonline.com.au',
    //nextLinkSelector: 'div.pagination > pagination-template > ul > li.ng-star-inserted>a.next',
    nextLinkSelector: 'div.pagination > pagination-template > ul > li.ng-star-inserted:not([class*="active"]):last-child > a.ng-star-inserted',
    loadedSelector: 'div.grid-container-flex',
  },
};
