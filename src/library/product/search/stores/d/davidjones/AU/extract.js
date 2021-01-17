const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    transform: transform,
    domain: 'davidjones.com',
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
    let count = document.querySelectorAll('div.products.sli_container  div[data-tb-sid="st_result-container-wrapper"]').length;
    while (count <= 150) {
      if (document.querySelector('div.sli_infinite_wrapper > button.sli_load_more_button:not([disabled])')) {
        document.querySelector('div.sli_infinite_wrapper > button.sli_load_more_button').click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        count = document.querySelectorAll('div.products.sli_container  div[data-tb-sid="st_result-container-wrapper"]').length;   
      } else {
        break;
      }      
    }
  });
  return await context.extract(productDetails, { transform });
}