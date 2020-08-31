
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    nextLinkSelector: 'button.ais-infinite-hits--showmoreButton',
    loadedSelector: 'div.item-list',
    domain: 'betta.com.au',
    zipcode: '',
  },
};
