
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    transform: cleanUp,
    domain: 'boxed.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // const zoom = document.querySelector('.magnifyframe');

      // if (zoom) {
      //   zoom.setAttribute('zoom', 'yes');
      // }

      // function addElementToDocument (id, key, value) {
      //   const catElement = document.createElement('div');
      //   catElement.id = id;
      //   catElement.setAttribute('value', key);
      //   catElement.innerText = value;
      //   catElement.style.display = 'none';
      //   document.body.appendChild(catElement);
      // };
    });

    await context.extract(productDetails);
  },
};
