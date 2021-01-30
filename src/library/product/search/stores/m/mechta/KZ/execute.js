
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    domain: 'mechta.kz',
    // url: 'https://www.mechta.kz/search/index.php?q={searchTerms}',
    url: 'https://www.mechta.kz/search/{searchTerms}/',
    loadedSelector: 'div.hoverCard-child.bg-white',
    // noResultsXPath: '//div[@class="bg-color10 q-mt-xl q-pt-sm"]/div[contains(., "ничего не найдено")]',
    zipcode: "''",
  },
};
