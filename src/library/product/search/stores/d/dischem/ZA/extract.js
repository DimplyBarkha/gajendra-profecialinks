const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'dischem',
    transform,
    domain: 'dischem.co.za',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.evaluate(async function () {
  //   let scrollTop = 0;
  //   while (scrollTop !== 20000) {
  //     await stall(500);
  //     scrollTop += 1000;
  //     window.scroll(0, scrollTop);
  //     if (scrollTop === 20000) {
  //       await stall(5000);
  //       break;
  //     }
  //   }
  //   function stall(ms) {
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         resolve();
  //       }, ms);
  //     });
  //   }
  // });
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  return await context.extract(productDetails, { transform });
}
