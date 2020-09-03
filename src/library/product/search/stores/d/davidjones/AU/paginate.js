
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    nextLinkSelector: 'button.sli_load_more_button',    
    loadedSelector: '#page-content',
    domain: 'davidjones.com',
    zipcode: '',
  },
};
