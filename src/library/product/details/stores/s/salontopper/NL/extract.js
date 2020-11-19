const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    transform: cleanUp,
    domain: 'salontopper.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // function addElementToDocument (key, value, src) {
      //   const catElement = document.createElement('div');
      //   catElement.id = key;
      //   catElement.innerText = value;
      //   catElement.setAttribute('src', src);
      //   catElement.style.display = 'none';
      //   document.body.appendChild(catElement);
      // }
      // adding first variant
      // const productIds = [...document.querySelectorAll('select[class="autoredirect"] option')].map(e => e.getAttribute('value').split('-').pop());
    });

    await context.extract(productDetails, { transform });
  },

};
