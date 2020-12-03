
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'rohlik',
    transform,
    domain: 'rohlik.cz',
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
      if (document.querySelector('#react-tabs-0')) {
        document.querySelector('#react-tabs-0').click();
      }
      const value = document.querySelector('div.sc-10utft9-2');
      const val = document.querySelector('div.ckContent');
      if (value) {
        getDesc(value);
      } else if (val) {
        getDesc(val);
      }
      function getDesc (data) {
        [...data.children].forEach(item => {
          if (item.nodeName === 'UL') {
            [...item.children].forEach(val => {
              text += ` || ${val.textContent}`;
              bulletText += `|| ${val.textContent}`;
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
