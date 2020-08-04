
/**
 *
 * @param { { url: any, zipcode: any, storeId: any } } inputs
 * @param { { country: any, domain: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { someAction: ImportIO.Action, someFunction: () => void, someExtraction: string } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode, storeId } = inputs;
  console.log('type of ', typeof (zipcode));
  console.log('url, zipcode, storeId', url, zipcode, storeId);
  await context.waitForSelector("button[title=' Modificar']");
  await context.click("button[title=' Modificar']");
  await context.waitForSelector('input.sale-point__postal-code-input');
  await context.setInputValue('input.sale-point__postal-code-input', (zipcode).toString());
  await context.waitForSelector('button.options-buttons__accept');
  await context.click('button.options-buttons__accept');
  await context.waitForNavigation({ timeout: 30000, waitUntil: 'load' });
  await new Promise(resolve => setTimeout(resolve, 5000));
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'ES',
    domain: 'carrefour.es',
    store: 'carrefour',
    zipcode: '',
  },
  implementation,
};
