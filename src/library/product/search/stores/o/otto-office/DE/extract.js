const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto-office',
    transform: transform,
    domain: 'otto-office.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv1 (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('a[class="oo-link fftracking-productclick"] b')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const rawRating = document.querySelectorAll('div[class="item-rating-stars_gold ooB-abs"]');
    let temp, temp1;
    for (let i = 0; i < rawRating.length; i++) {
      temp = rawRating[i].getAttribute('style');
      if (temp.includes('width:')) {
        temp1 = temp.split('width:')[1];
        temp1 = temp1.split('px')[0];
        temp1 = parseInt(temp1);
        temp1 = (temp1 * 5) / 65;
        addHiddenDiv1('aggrating', temp1, i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
};
