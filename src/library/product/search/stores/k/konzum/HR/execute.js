
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HR',
    store: 'konzum',
    domain: 'konzum.hr',
    url: 'https://www.konzum.hr/web/search?utf8=%E2%9C%93&search%5Bscope%5D=products&filters%5BKategorije%5D%5B%5D=&search%5Bterm%5D={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
