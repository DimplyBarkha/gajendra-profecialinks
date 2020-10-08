const{transform} = require('./transform');

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
    document.querySelectorAll('div.loadbeeTabContent > iframe').forEach(node => {      
    alert(node.innerHTML);
   });
   
  
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    transform: transform,
    domain: 'ep.at',
    zipcode: '',
  },
  implementation,
};
