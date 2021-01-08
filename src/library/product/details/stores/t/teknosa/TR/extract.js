const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(() => {
      const scriptPrice = document.querySelector('#schemaJSON');
      /*eslint-disable */
      const regexPrice = /((?<="lowPrice\"\:\s\").+?(?="))/;
      /*eslint-disable */
      const regexListPrice = /((?<="highPrice\"\:\s\").+?(?="))/;
      const currency = 'TL';
      const price = scriptPrice.innerText.match(regexPrice);
      const listPrice = scriptPrice.innerText.match(regexListPrice);
      listPrice[0] = listPrice[0].replace('.', ',');
      scriptPrice.setAttribute('correctPrice', price[0] + ' ' + currency);
      if (price[0] !== listPrice[0]) {
        scriptPrice.setAttribute('correctListPrice', listPrice[0] + ' ' + currency);
      }
    });
    await context.extract(productDetails, { transform });
  },
};
