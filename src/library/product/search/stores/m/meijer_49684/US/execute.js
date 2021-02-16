
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    domain: 'meijer.com',
    url: 'https://www.meijer.com/shop/en/search/?q={searchTerms}&page=0',
    loadedSelector: 'div[class="product-tile-container"] div[class="product-item"]',
    noResultsXPath:'//div[@class="search-empty row "]',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { searchURL, keywords, query } = inputs;

  console.log(`searchURL: ${searchURL}`);
  url = searchURL || url;
  console.log(url);

  if (url.includes('{searchTerms}') && !keywords) throw new Error('No keywords provided');
  if (url.includes('{queryParams}') && !query) throw new Error('No query provided');

  const destinationUrl = url
    .replace('{searchTerms}', encodeURIComponent(keywords))
    .replace('{queryParams}', query);
  await dependencies.goto({ ...inputs, url: destinationUrl });
  await context.evaluate(async function () {
    await new Promise(r => setTimeout(r, 2000));
    console.log("waiting for first link")
    try {
      // @ts-ignore
      //document.querySelector('span[class="glyphicon glyphicon-edit js-change-store-link"]').click()
      document.querySelector('div[id="store-flyout-link-root"] a').click()
      await new Promise(r => setTimeout(r, 3000));
      console.log("waiting for open store input box")
      // @ts-ignore
      document.querySelector('a[class="StoreFlyout__changeStore"]').click();
      await new Promise(r => setTimeout(r, 3000));
      console.log("waiting for send store id to input link");
      var att = document.createAttribute('value');
      att.value = "49684"
      //att.value = "Knapp’s Corner, Grand Rapids"
      document.querySelector('input[id="store-flyout-address"]').setAttributeNode(att);
      // @ts-ignore
      document.querySelector('button[class="StoreFlyout__search-button btn btn-primary"]').click();
      await new Promise(r => setTimeout(r, 3000));
      console.log("waiting for search link");
      // @ts-ignore
      document.querySelector('button[class="StoreFlyout__myStore btn btn-primary StoreFlyout__selectOptions"]').click();
      // await new Promise(r => setTimeout(r, 5000));
      console.log("waiting for submit link");
    }
    catch (e) {

    }
  });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log(`noResultsXPath: ${noResultsXPath}`);
  return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
}