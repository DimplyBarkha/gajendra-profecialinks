module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'apotea',
    domain: 'apotea.se',
    loadedSelector: 'div#product-image',
    noResultsXPath: '//p[contains(text(),"kunde tyvärr inte hittas")]',
    zipcode: '',
  },
};