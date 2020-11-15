
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    domain: 'mechta.kz',
    url: 'https://www.mechta.kz/search/index.php?q={searchTerms}',
    loadedSelector: 'div.catalog_items_list div.aa_sectiontov',
    noResultsXPath: '//div[@class="j_detectum_search" and contains(text(),"По текущему запросу нет товаров")]',
    zipcode: "''",
  },
};
