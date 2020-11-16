const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    transform,
    domain: 'ah.nl',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      let text = '';
      let bulletText = '';
      const value = document.querySelector('div.product-summary');
      if (value) {
        getDesc(value);
      }
      const val = document.querySelector('div.product-info-description');
      if (val) {
        getDesc(val);
      }
      function getDesc (data) {
        [...data.children].forEach(item => {
          if (item.nodeName === 'UL') {
            [...item.children].forEach(val => {
              text += ` || ${val.textContent}`;
              bulletText += ` || ${val.textContent}`;
            });
          } else {
            text += ` ${item.textContent}`;
          }
        });
      }
      const description = document.createElement('div');
      const bulletDescription = document.createElement('div');
      description.id = 'desc';
      bulletDescription.id = 'bulletdesc';
      description.innerText = text.replace(/\s{2,}/g, ' ');
      bulletDescription.innerText = bulletText.replace(/\s{2,}/g, ' ');
      document.body.appendChild(description);
      document.body.appendChild(bulletDescription);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },

};
