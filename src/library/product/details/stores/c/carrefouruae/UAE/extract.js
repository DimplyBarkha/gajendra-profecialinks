
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UAE',
    store: 'carrefouruae',
    transform,
    domain: 'carrefouruae.com',
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
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      }
      let shippingArr = [];
      let shippingFinal;
      let shippingInfo = document.querySelectorAll('div.productinfo__header div.productinfo-misc__box');
      for (let index = 0; index < shippingInfo.length; index++) {
        // @ts-ignore
        const element = shippingInfo[index].innerText;
        if((element.includes('Sold by'))){
          shippingArr.push(element)
        }
      }
      shippingFinal = shippingArr.join(' ');
      addHiddenDiv('cc_shippingInfo',shippingFinal);
    });
    return await context.extract(productDetails, { transform });
  },
};
