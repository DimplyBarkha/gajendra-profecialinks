const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'maquillalia',
    transform: transform,
    domain: 'maquillalia.com',
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
  const originalDiv = document.querySelectorAll('main span[class="Stars"]')[index];
  originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  let firstChildNode;
  const aggregateRating = document.querySelectorAll('main span[class="Stars"]')
  for (let k = 0; k < aggregateRating.length; k++) {
  firstChildNode = aggregateRating[k].getElementsByClassName('BgicoN-star On').length
  addHiddenDiv('aggregateRating', firstChildNode, k);
  }
  });
  //rank end
  return await context.extract(productDetails, { transform });
  }
