const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    transform, // middle ware for processing data
    domain: 'netonnet.no',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    await context.evaluate(async function () {
      const overlay = document.getElementById('headingOne');
      if (overlay !== undefined) {
        overlay.click();
      }

      const inTheBox = document.getElementById('headingFour');
      if (inTheBox !== undefined) {
        inTheBox.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      }

      const collapseFive = document.querySelector('div[data-target="#collapseFive"]')
      collapseFive.classList.remove("collapsed");
      document.getElementById('collapseFive').classList.add('in');

    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
};