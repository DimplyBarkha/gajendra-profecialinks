
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'DE',
    domain: 'flaconi.de',
    store: 'flaconi',
    zipcode: '',
    
  },
  implementation,
  
};
async function implementation (
  inputs, parameters, context, dependencies,
) {
    await context.evaluate(async function () {
      const element = document.querySelector('button#uc-btn-accept-banner');
      console.log('element: ', element);
      if (element) {
        // @ts-ignore
        element.click();
      }
    });
  
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
}
