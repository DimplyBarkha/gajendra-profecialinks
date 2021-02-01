const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('td.select.option_select.option_truestock.option_required select option[value]')) ? document.querySelectorAll('td.select.option_select.option_truestock.option_required select option[value]').length : 0;
  });
  console.log('variantLength:: ', variantLength);
  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        return document.querySelectorAll('td select option[value]')[j].click();
      }, j);
      // await context.click(`ul.topic li label`);
      console.log('Inside variants', j);
      // await preparePage(j, variantLength);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  }
  try {
    await context.waitForSelector('div.price-del del');
    // await context.click('div.modal-footer>a.btn-success')
    // await context.click('div.modal-footer > button')
  } catch (error) {
    console.log('listprice up not loded', error);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    transform: transform,
    domain: 'naszezoo.pl',
    zipcode: '',
  },
  implementation,
};
