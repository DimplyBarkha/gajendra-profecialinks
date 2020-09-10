
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log(JSON.stringify(inputs))
  await context.goto(inputs.url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  await context.evaluate(async function () {
    let concentPopUp = document.querySelector("button[data-test='consent-modal-confirm-btn']");
    if (concentPopUp) {
      document.querySelector("button[data-test='consent-modal-confirm-btn']").click()
    }
    let country = document.querySelector('a[data-test="country-BE"]');
    if (country) {
      country.click();
    }
  });
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation
};
