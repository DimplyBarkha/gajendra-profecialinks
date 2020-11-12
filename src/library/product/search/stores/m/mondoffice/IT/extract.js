async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.waitForSelector('#toolbar__all_anchor');
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    addElementToDocument('search_url', location.href);
  });

  // Check if cookies pop-up appeared
  const doesPopupExist = await context.evaluate(function () {
    return Boolean(document.querySelector('#onetrust-accept-btn-handler'));
  });
  const doesPopupInfoExist = await context.evaluate(function () {
    return Boolean(document.querySelector('.kamPopup__overlay'));
  });

  if (doesPopupExist) {
    await context.click('#onetrust-accept-btn-handler');
  }
  if (doesPopupInfoExist) {
    await context.click('.kamPopup__close');
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
