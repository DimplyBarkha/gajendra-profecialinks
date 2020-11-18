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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      // function addElementToDocument (key, value, src) {
      //   const catElement = document.createElement('div');
      //   catElement.id = key;
      //   catElement.innerText = value;
      //   catElement.setAttribute('src', src);
      //   catElement.style.display = 'none';
      //   document.body.appendChild(catElement);
      // }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      const openIngredients = document.querySelector('a[href="#ingredients"]');
      // @ts-ignore
      if (openIngredients) openIngredients.click();
    });
    await context.extract(productDetails, { transform });
  },

};
