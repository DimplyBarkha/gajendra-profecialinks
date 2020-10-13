
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'apopro',
    nextLinkSelector: 'li[class="active"] + li:not(.disable-pagination) > a',
    loadedSelector: 'section.product-item:nth-last-child(1) div.search-thumbnail a img',
    domain: 'apopro.dk',
    zipcode: '',
  },
};
