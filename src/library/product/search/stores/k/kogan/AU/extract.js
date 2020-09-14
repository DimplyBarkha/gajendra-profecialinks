async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }

    const element = document.evaluate('//script[contains(.,"k3.bootstrapData = JSON.parse")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    
    console.log("abhay" + element);
    // @ts-ignore
    // let pageStartIndex = paginationDiv ? paginationDiv.innerText.match(/\d+/) : 0;

  });
  return await context.extract(productDetails);
}
//const { transform } = require('../../../../shared');
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    transform,
    domain: 'kogan.com',
    zipcode: '',
  },    
};
