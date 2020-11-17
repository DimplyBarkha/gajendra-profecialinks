const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    transform,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      function onlyNumbersAndDot (string) {
        return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, ".");string = Math.round( parseFloat(string) * 100) / 100;
      }
      const pages = document.querySelectorAll('.paginate-async > ul > li');
      const a = [];
      pages.forEach(e => {
        a.push(e.innerText);
      });
      const b = a.filter(e => onlyNumbersAndDot(e));
      const maxPageNumber = Math.max(...b);
      console.log(maxPageNumber, 'ssss');
    });

    return await context.extract(productDetails, { transform });
  },
};
