module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
  country: 'US',
  store: 'ajmadison',
  nextLinkSelector: null,//'link-alt line-height-1 px05 search-page__pagination-next',
  loadedSelector: null,//'body',
  domain: 'ajmadison.com',
  openSearchDefinition: {
    template: 'https://www.ajmadison.com/b.php/Nao~10000%3BNtt~{searchTerms}',
  },
  zipcode: '',
  },
  };