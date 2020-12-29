async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  // const tempurl = `https://www.petsmart.com`;
  // await context.goto(tempurl, { timeout: 30000 });
  // await context.evaluate(async () => {
  //   const clickButton = document.querySelector('#dp-header > div.row.mobile-header > div.dp-promo2 > div > section > a > div');
  //   if (clickButton) {
  //     clickButton.click();
  //     await new Promise((resolve) => setTimeout(resolve, 20000));
  //   }
  // })
  // await context.setInputvalue('#dp-header > div.row.mobile-header > div.top-banner > div.header-search-bar > div > form > input.dp-search-input', id);
  // await context.evaluate(() => {
  //   const searchElement = document.querySelector('#dp-header > div.row.mobile-header > div.top-banner > div.header-search-bar > div > form > input.dp-search-input');
  //   if (searchElement) {
  //     searchElement.value = 1221685
  //   }
  //   const searchButton = document.querySelector('#dp-header > div.row.mobile-header > div.top-banner > div.header-search-bar > div > form > input[type=submit]:nth-child(2)');
  //   if (searchButton) {
  //     searchButton.click();
  //   }
  // })
  await dependencies.goto({ url, zipcode, storeId });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  // const imageSelector = `div[class="react-viewer-canvas"]>img`
  // addOptionalWait(imageSelector);
  // TODO: Check for not found?
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'petsmart',
    domain: 'petsmart.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  // implementation,
};
