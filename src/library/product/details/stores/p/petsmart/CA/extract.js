const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    transform: transform,
    domain: 'petsmart.ca',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async function () {
      const getdescription = document.querySelector('#react-tabs-0');
      if (getdescription) {
        getdescription.click();
        const descriptions = document.querySelector('div.react-tabs__tab-content > p') ? document.querySelector('div.react-tabs__tab-content > p').innerText.trim() : null;
        document.body.setAttribute('description', descriptions);
      }

      const getingredient = document.querySelector('#react-tabs-2');
      if (getingredient) {
        getingredient.click();
        const nutritionalInfo = document.querySelector('div.react-tabs__tab-content > p') ? document.querySelector('div.react-tabs__tab-content > p').innerText.trim() : null;
        document.body.setAttribute('nutritionInfo', nutritionalInfo);
      }

      const getdirection = document.querySelector('#react-tabs-4');
      if (getdirection) {
        getdirection.click();
        const direction = document.querySelector('div.react-tabs__tab-content') ? document.querySelector('div.react-tabs__tab-content').innerText.trim() : null;
        document.body.setAttribute('directions', direction);
      }
    });

    await context.extract(productDetails, { transform });
  },

};
