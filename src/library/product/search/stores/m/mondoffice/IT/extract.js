async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.waitForSelector('#toolbar__all_anchor');
  await context.evaluate(async function () {
    const el = document.querySelector('body');
    el.setAttribute('search_url', location.href);
  });

  // Check if cookies pop-up appeared
  const doesPopupExist = await context.evaluate(function () {
    return Boolean(document.querySelector('#onetrust-accept-btn-handler'));
  });
  if (doesPopupExist) {
    await context.click('#onetrust-accept-btn-handler');
  }
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform: null,
    domain: 'mondoffice.com',
    zipcode: '',
  },
  implementation,
};
