module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    nextLinkSelector: 'ul.pages li.next a',
    loadedSelector: 'ul.productLister li.gridItem:nth-last-child(1)',
    domain: 'sainsburys.co.uk',
  },
};
