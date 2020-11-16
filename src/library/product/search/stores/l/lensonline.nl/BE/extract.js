const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'lensonline.nl',
    transform: cleanUp,
    domain: 'lensonline.nl',
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
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("li[class='column col-tn-12 col-xs-6 col-sm-3 col-lg-3 productitem']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    var tempVariable;
    // @ts-ignore
    const allIDs = document.querySelectorAll("#prod_boxes > li > a > script");
    for (let i = 0; i < allIDs.length; i++) {
      // @ts-ignore
      tempVariable = allIDs[i].innerText;
      tempVariable = tempVariable.split(',');
      tempVariable = tempVariable[1].split(':')[1].replace(/"/g, '');
      addHiddenDiv('productID', tempVariable, i);
      addHiddenDiv('rankOrganic', i + 1, i);
    }
  });
  return await context.extract(productDetails, { transform });
}