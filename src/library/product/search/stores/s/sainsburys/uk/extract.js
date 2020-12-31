const { transform } = require('../../../../shared');
// const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    transform: transform,
    domain: 'sainsburys.co.uk',
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
  await context.evaluate(async function () {
    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class='productNameAndPromotions']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const url = window.location.href
    const products = document.querySelectorAll("div[class='productNameAndPromotions']");
    for (let i = 0; i < products.length; i++) {
    addHiddenDiv('URL', url, i);
  }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}