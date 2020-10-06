module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    nextLinkSelector: 'div[data-ajaxcontent="productpagebutton"]>div>div',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
};
