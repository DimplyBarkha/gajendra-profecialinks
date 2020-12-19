
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
    var query = url.split('/');
		  addHiddenDiv("custon_sku", 'leclercdrive_' + query[query.length-1].replace(/\D/g,''));
    	addHiddenDiv("product_custom_url", url);
    });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclerc',
    transform: transform,
    domain: 'leclercdrive.fr',
    zipcode: '',
  },
  implementation,
};