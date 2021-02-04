const {transform} = require('../PT/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'continente',
    transform,
    domain: 'continente.pt',
    zipcode: '',
  },
  implementation
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
    let moreInformation = document.querySelector('div.moreInfoButtonArea input.ecsfShowRichDataButton');
    if(moreInformation){
      moreInformation.click();
    }
     await new Promise(resolve => setTimeout(resolve, 1000));
  })
  return await context.extract(productDetails, { transform });
}
