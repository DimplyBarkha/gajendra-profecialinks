const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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
    const elList = document.querySelectorAll("div.tm-marketplace-listing-body__item p");
    let inTheBox = null;
    elList.forEach(function(el) {
      if (el.innerHTML.indexOf("in the box") !== -1 || el.innerHTML.indexOf("In the box") !== -1) {
        inTheBox = el;
      }
    });
    const inTheBoxText = inTheBox && inTheBox.nextElementSibling ? inTheBox.nextElementSibling.textContent.replace(/\n/g, ' || ') : '';
    addHiddenDiv('ii_inTheBoxText', inTheBoxText);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    transform,
    domain: 'trademe.co.nz',
    zipcode: "''",
  },
  implementation,
};
