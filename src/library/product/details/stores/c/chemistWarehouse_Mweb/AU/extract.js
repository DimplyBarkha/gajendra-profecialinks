const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  // implementation: async (inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) => {
  //   await context.evaluate(async function () {
  //     function addHiddenDiv (id, content) {
  //       const newDiv = document.createElement('div');
  //       newDiv.id = id;
  //       newDiv.textContent = content;
  //       newDiv.style.display = 'none';
  //       document.body.appendChild(newDiv);
  //     }

  //   });
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   return await context.extract(productDetails, { transform });
  // },
};
