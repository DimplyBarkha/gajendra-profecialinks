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
    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      let counterRes = document.querySelector('.search-header_sticky__1PuT0 > p').innerText;
      if (counterRes) {
        const reg = /[^0-9.]/g;
        counterRes = counterRes.replace(reg, '') * 1 / 36;
        counterRes = Math.ceil(counterRes);
        let searchTermsString = location.href;
        const start = searchTermsString.indexOf('=');
        searchTermsString = searchTermsString.slice(start, searchTermsString.length).replace('=', '');
        console.log(counterRes);
        if (counterRes > 1) {
          window.location = `https://www.ah.be/zoeken?query=${searchTermsString}&page=${counterRes}`;
        }
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
