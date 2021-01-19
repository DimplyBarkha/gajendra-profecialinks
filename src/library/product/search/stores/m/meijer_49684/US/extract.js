const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    transform: transform,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.evaluate(async function () {
  //   let scrollTop = 0;
  //   while (scrollTop <= 20000) {
  //       await stall(500);
  //       scrollTop += 500;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //           await stall(8000);
  //           break;
  //       }
  //   }
  //   function stall(ms) {
  //       return new Promise(resolve => {
  //           setTimeout(() => {
  //               resolve();
  //           }, ms);
  //       });
  //   }
  // })
  await context.evaluate(async function () {
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    // Method to Retrieve Xpath content of a Single Node
  
    const URL = window.location.href;
    try {
      document.getElementById('pd_url').remove();
    } catch (error) {
    }
    addElementToDocument('pd_url', URL);
  });
  return await context.extract(productDetails, { transform });
}