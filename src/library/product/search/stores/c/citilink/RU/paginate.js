
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product_category_list div',
    noResultsXPath: '//h2[contains(text(), "По Вашему запросу")]',
    openSearchDefinition: {
      template: 'https://www.citilink.ru/search/?text={searchTerms}&page={page}',
    },
    domain: 'citilink.ru',
    zipcode: '',
  },
};
