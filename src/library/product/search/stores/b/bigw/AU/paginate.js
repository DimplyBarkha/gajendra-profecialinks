
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    nextLinkSelector: 'ul > li.next',    
    loadedSelector: 'div.product-listing',   
    domain: 'bigw.com.au',
    zipcode: '',
  },
};
