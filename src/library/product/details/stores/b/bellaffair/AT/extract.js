const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    transform: cleanUp,
    domain: 'bellaffair.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const pdfPresent = document.querySelector('ul.downloads>li.pdf a')
        ? document.querySelector('ul.downloads>li.pdf a').getAttribute('href') : '';
      if (pdfPresent) {
        addElementToDocument('pdfPresent', 'Yes');
      } else addElementToDocument('pdfPresent', 'No');
    });
    await context.extract(productDetails);
  },
};
