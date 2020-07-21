module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    nextLinkSelector: 'div.paginationBottom ul.pages li.next a',
    domain: 'sainsburys.co.uk',
  },
};
