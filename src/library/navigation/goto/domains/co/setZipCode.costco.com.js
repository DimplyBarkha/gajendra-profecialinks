
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'costco.com',
    store: 'costco',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    const homePage = await context.evaluate(() => document.querySelector('a#delivery-postal-change'));
    if (homePage) {
      // @ts-ignore
      await context.evaluate((zipcode) => { document.querySelector('a#delivery-postal-change').value = zipcode; }, zipcode);
      await context.click('a#delivery-postal-change');
      await new Promise(resolve => setTimeout(resolve, 3000));
      // @ts-ignore
      await context.evaluate((zipcode) => { document.querySelector('input#postal-code-input').value = zipcode; }, zipcode);
      await context.click('input#postal-code-submit');
      await context.waitForNavigation();
      await new Promise(resolve => setTimeout(resolve, 3000));
      // @ts-ignore
      await context.evaluate((zipcode) => { document.querySelector('div.modal-content').value = zipcode; }, zipcode);
      await context.click('button#costcoModalBtn2');
      await new Promise(resolve => setTimeout(resolve, 20000));
    }
  },
};
