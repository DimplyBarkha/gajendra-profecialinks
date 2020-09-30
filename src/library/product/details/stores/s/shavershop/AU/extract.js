const {transform} = require('./transform')

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content,elementName) {
      const newDiv = document.createElement(elementName);
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    document.querySelectorAll('div.recommendations').forEach(node => {      
    node.remove();
   });
    let i = 0;
    document.querySelectorAll('div.product-stick-button > button#add-to-cart> span').forEach(node => {
       var productTileObject = node.attributes[1].value.trim();
       var productData =JSON.parse(productTileObject);      
      addHiddenDiv(node,productData.brand,productData.brand,'brand');
      i++;
    });
  });
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    transform: transform,
    domain: 'shavershop.com.au',
    zipcode: '',
  },
  implementation,
};
