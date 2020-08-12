
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {

  /* await context.waitForXPath('//button[@data-test="storeId-utilityNavBtn"]');

  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    document.getElementById('storeId-utilityNavBtn').click();
    await stall(1000);
  });
  await context.setInputValue('#zipOrCityState', zipcode);
  await context.evaluate(async function () {
    document.querySelector('button[data-test="storeLocationSearch-button"]').click();
  });
  await context.waitForXPath("//button[@data-test='storeId-listItem-setStore']");
  await context.evaluate(function () {
    document.querySelectorAll('button[data-test="storeId-listItem-setStore"]')[0].click();
  }); */

}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'target.com',
    store: 'target',
  },
  implementation,
};
