
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    nextLinkSelector: 'div.sli_infinite_wrapper > button.sli_load_more_button',    
    loadedSelector: 'div#sli_content_wrapper',
    domain: 'davidjones.com',
    zipcode: '',
  },
};
