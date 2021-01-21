
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'zooroyal',
    nextLinkSelector: 'ul.pagination li:nth-last-child(2) a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#article-list.article-list-container.row.list-group.flex__wrapper',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'zooroyal.de',
    zipcode: '',
  },
};
