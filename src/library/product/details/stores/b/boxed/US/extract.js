
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
      const productDetails = document.querySelector('a[data-tab-key="productDetails"]');
      // @ts-ignore
      if (productDetails) productDetails.click();
    });
    await context.evaluate(async function () {
      // const zoom = document.querySelector('.magnifyframe');

      // if (zoom) {
      //   zoom.setAttribute('zoom', 'yes');
      // }

      // function addElementToDocument (id, value) {
      //   const catElement = document.createElement('div');
      //   catElement.id = id;
      //   catElement.innerText = value;
      //   catElement.style.display = 'none';
      //   document.body.appendChild(catElement);
      // };
      // const nameExtendedNodes = document.querySelectorAll('div#description p')
      //   ? document.querySelectorAll('div#description p') : [];
      // // @ts-ignore
      // const nameExtendedText = [...nameExtendedNodes].map(e => e.innerText).join('  ');
      // addElementToDocument('nameExtended', nameExtendedText);
    });

    await context.extract(productDetails);
  },
};
