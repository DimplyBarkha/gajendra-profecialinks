
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'detsky',
    domain: 'detmir.ru',
    url: 'https://www.detmir.ru/search/results/page/?qt={searchTerms}&searchType=common',
    loadedSelector: null,
    noResultsXPath: '//*[@id="app-container"]/div[2]/div[1]/main/div/div[2]/div/div/ul/li',
    zipcode: '',
  },
};
