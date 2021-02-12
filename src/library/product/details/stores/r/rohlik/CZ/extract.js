
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
      if (val) {
        getDesc(val);
      } else if (value) {
        getDesc(value);
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
      let brandText = '';
      const dataString = document.querySelector('#__NEXT_DATA__') ? document.querySelector('#__NEXT_DATA__').textContent : '';
      if (dataString) {
        var data = JSON.parse(dataString);
        if (data.props.initialProps.pageProps.productDetail.brand) {
          brandText = data.props.initialProps.pageProps.productDetail.brand;
        }
      }
      const description = document.createElement('div');
      const bulletDescription = document.createElement('div');
      const brand = document.createElement('div');
      description.id = 'desc';
      brand.id = 'brand';
      bulletDescription.id = 'bulletdesc';
      description.innerText = text.replace(/\s{2,}/g, ' ').split('O výrobci')[0];
      bulletDescription.innerText = bulletText.replace(/\s{2,}/g, ' ');
      brand.innerText = brandText;
      document.body.appendChild(description);
      document.body.appendChild(bulletDescription);
      document.body.appendChild(brand);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
