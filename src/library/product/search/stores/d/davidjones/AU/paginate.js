
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    nextLinkSelector: 'button[data-tb-sid="st_infinite-button"]',    
    loadedSelector: '#page-content',
    domain: 'davidjones.com',
    zipcode: '',
  },
};
