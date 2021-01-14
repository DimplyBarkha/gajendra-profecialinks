let {transform} = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
		function addHiddenDiv (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.className = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
		}
    var url = window.location.href;
    addHiddenDiv("product_custom_url", url);
    const descArray = [];
    var desc = document.querySelectorAll('div#note p');
    for (let i = 0; i < desc.length; i++) {
      const descText = desc[i].innerText;
      descText && descArray.push(descText);
  }
  addHiddenDiv("ii_details",descArray);
    });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'fastenal',
    transform: transform,
    domain: 'fastenal.com',
    zipcode: '',
  },
  implementation,
};

