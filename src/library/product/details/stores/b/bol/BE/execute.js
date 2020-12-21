
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.goto(inputs.url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  const countryClicked = await context.evaluate(async function () {
    const concentPopUp = document.querySelector("button[data-test='consent-modal-confirm-btn']");
    if (concentPopUp) {
      document.querySelector("button[data-test='consent-modal-confirm-btn']").click();
    }
    const country = document.querySelector('a[data-test="country-BE"]');
    if (country) {
      return true;
      country.click();
    }
    return false;
  });

  if (countryClicked) {
    await context.waitForNavigation();
  }
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
  implementation,
};
