const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  const { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
  await dependencies.goto({ ...inputs, url: builtUrl || url });
  await context.evaluate(async function () {
    try {
      // @ts-ignore
      document.querySelector('span[class="glyphicon glyphicon-edit js-change-store-link"]').click()
      await new Promise(r => setTimeout(r, 4000));
      console.log("waiting for open store input box")
      // @ts-ignore
      document.querySelector('a[class="StoreFlyout__changeStore"]').click()
      await new Promise(r => setTimeout(r, 4000));
      console.log("waiting for send store id to input link")
      var att = document.createAttribute('value')
      att.value = "49684"
      document.querySelector('input[id="store-flyout-address"]').setAttributeNode(att)
      // @ts-ignore
      document.querySelector('button[class="StoreFlyout__search-button btn btn-primary"]').click()
      await new Promise(r => setTimeout(r, 5000));
      console.log("waiting for search link")
      // @ts-ignore
      document.querySelector('button[class="StoreFlyout__myStore btn btn-primary StoreFlyout__selectOptions"]').click()
      // await new Promise(r => setTimeout(r, 5000));
      console.log("waiting for submit link")
    }
    catch (e) {

    }
  });
  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    domain: 'meijer.com',
    loadedSelector: 'div[itemprop="name"]',
    noResultsXPath: '//div[@class="search-empty row "]',
    zipcode: '',
  },
  implementation,
};
