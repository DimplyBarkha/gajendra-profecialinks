const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    transform: cleanUp,
    domain: 'pnp.co.za',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(() => {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const listPrice = document.querySelector('div.oldprice') ? document.querySelector('div.oldprice').innerText : '';
      if (listPrice) addElementToDocument('listPrice', listPrice.replace(/(.*)(\d{2})/g, '$1,$2'));
    });
    await context.extract(productDetails, { transform });
  },
};
