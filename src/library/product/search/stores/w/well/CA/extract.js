const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'well',
    transform,
    domain: 'well.ca',
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
    let count = document.querySelectorAll('div#categories_main_content div.product-item').length;
    while (count <= 150) {
      if (document.querySelector('a#product_grid_load')) {
        document.querySelector('a#product_grid_load').click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        count = document.querySelectorAll('div#categories_main_content div.product-item').length;
      } else {
        break;
      }
    }
    document.querySelectorAll('div#categories_main_content div.product-item').forEach(element => {
      let counter = 0;
      element.querySelectorAll('linearGradient').forEach(item => {
        const data = item.getAttribute('x1').replace('%', '');
        if (parseFloat(data) > 50) {
          counter = counter + 1;
        } else if (parseFloat(data) === 50) {
          counter = counter + 0.5;
        }
      });

      const aggRating = document.createElement('div');
      aggRating.className = 'aggRating';
      aggRating.style.display = 'none';
      aggRating.textContent = counter.toFixed(1);
      element.appendChild(aggRating);
    });
  });
  return await context.extract(productDetails, { transform });
}
