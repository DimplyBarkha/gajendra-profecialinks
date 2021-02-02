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
      const addToCart = document.querySelector('#addToCartButton');
      /*eslint-disable */
      const regexPrice = /((?<="lowPrice\"\:\s\").+?(?="))/;
      /*eslint-disable */
      const regexListPrice = /((?<="highPrice\"\:\s\").+?(?="))/;
      const currency = "TL";
      const price = scriptPrice ? scriptPrice.innerText.match(regexPrice): null;
      const listPrice = scriptPrice ? scriptPrice.innerText.match(regexListPrice) : null;
      if (listPrice) {
        listPrice[0] = listPrice[0].replace(".", ",");
      }
      if (price) {
        price[0] = price[0].replace(".", ",");
      }
      if (addToCart && price) {
        scriptPrice.setAttribute("correctPrice", price[0] + " " + currency);
        if (price[0] !== listPrice[0]) {
          scriptPrice.setAttribute(
            "correctListPrice",
            listPrice[0] + " " + currency
          );
        }
      }
    });
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
      await stall(8000);
      break;
      }
      }
      function stall (ms)
       {
      return new Promise(resolve => {
      setTimeout(() => {
      resolve();
      }, ms);
      });
      }
      });
    await context.extract(productDetails, { transform });
  },
};
