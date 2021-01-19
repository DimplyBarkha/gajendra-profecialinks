// const { transform } = require('./transform');
const { transform } = require('../../../../shared');
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
    var count = 1;
    while (document.querySelector('.bloom-load-button')) {
      if (count < 5) {
        document.querySelector('.bloom-load-button').click();
        count++;
        await new Promise(r => setTimeout(r, 10000));
      } else {
        break;
      }
    }
    const itemContainers = document.querySelectorAll('#search-grid_0 > div.row.gutters-items-v2.grid-wrapper.product-grid-v2 > product-item-v2');
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const searchUrl = window.location.href;
      addHiddenDiv(itemContainer, 'search-url', searchUrl);
    }
  });
  return await context.extract(productDetails, { transform: parameters.transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'tomthumb',
    transform: transform,
    domain: 'tomthumb.com',
    zipcode: '75023',
  },
  implementation,
};
