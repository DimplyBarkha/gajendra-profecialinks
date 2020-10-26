const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.evaluate(() => {
    function addProp(selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };
    const allProducts = document.querySelectorAll('div.product-grid-item.ColUI-gjy0oc-0.ifczFg.ViewUI-sc-1ijittn-6.iXIDWU');
    let sum = 0
    for (let i=0; i < allProducts.length; i++){
      if (document.querySelectorAll('div.RippleContainer-sc-1rpenp9-0.dMCfqq')[i]){
        sum += 1;
      }
      addProp('div.RippleContainer-sc-1rpenp9-0.dMCfqq', i,'rankorganic', `${i + 1}`)
    }
    console.log(sum)
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  return await context.extract(productDetails, { transform });
}



module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: null,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation,
};
