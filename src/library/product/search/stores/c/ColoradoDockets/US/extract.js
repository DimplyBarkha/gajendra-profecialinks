const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'ColoradoDockets',
    transform,
    domain: 'courts.state.co.us',
    zipcode: "''",
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
  await context.select('select#County_ID','55');
  await context.select('select#Location_ID','63');
  await context.select('select#datesearchtype','month');
  await context.click('input#submitform');
  await context.waitForSelector('div#docketresults');
  await new Promise((resolve, reject) => setTimeout(resolve, 20000)); 
  return await context.extract(productDetails, { transform });
}
