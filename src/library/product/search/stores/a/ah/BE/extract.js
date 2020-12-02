const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    transform,
    domain: 'ah.be',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('url', location.href);
      const text = location.search;
      const start = text.indexOf('?query=');
      const end = text.indexOf('&page=');
      addElementToDocument('search_terms', text.slice(start + 7, end));
      // const btn = document.querySelector('load-more_root__9MiHC > button');
      // console.log(btn);
      const result = document.querySelector('.search-header_sticky__1PuT0 > p').innerText.replace('resultaten', '').trim();
      const element = document.querySelectorAll('#search-lane > div > article');
      if (+result >= element.length) addElementToDocument('rank', element.length);
    });
    await context.waitForSelector('#rank');
    return await context.extract(productDetails, { transform });
  },
};
