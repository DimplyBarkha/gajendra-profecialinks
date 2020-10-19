const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'apopro',
    transform,
    domain: 'apopro.dk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const getDescription = async function () {
        function timeout (ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await timeout(5000);
        let text = '';
        [...document.querySelector('.description').children].forEach(item => {
          if (item.nodeName === 'UL') {
            [...item.children].forEach(val => {
              text += ` || ${val.textContent}`;
            });
          } else {
            text += ` ${item.textContent}`;
          }
          document.body.setAttribute('desc', `Produktbeskrivelse ${text}`);
        });
      };
      if (document.querySelector('.description')) {
        await getDescription();
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
