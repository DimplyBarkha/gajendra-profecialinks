
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    domain: 'technodom.kz',
    url: 'https://www.technodom.kz/search?r46_search_query={searchTerms}',
    loadedSelector: 'main.CategoryPage',
    noResultsXPath: '//div[@class="r46t__results__title__wrap"]/div[@id="r46t-count"]/span[text()=0]',
    zipcode: '',
  },
};
