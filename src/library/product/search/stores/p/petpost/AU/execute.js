
/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  console.log('inputs.keywords', inputs.keywords);
  //await new Promise((resolve, reject) => setTimeout(resolve, 50000));
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  const tmpInput=encodeURIComponent(inputs.keywords);
  console.log('tmpInput before context', tmpInput);
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  const applyScroll = async function (context) {
    await context.evaluate(async function (inputs) {
      console.log('tmpInput after context', inputs);
      let keywords12=inputs.keywords;

      const hiddenDataDiv = document.createElement('div');
      hiddenDataDiv.id = 'jdCustomDivJSONData';
      hiddenDataDiv.style.display = 'none';
      document.body.appendChild(hiddenDataDiv);
      const allData = await fetch(`https://api.searchspring.net/api/search/search.json?siteId=14dsyu&resultsFormat=native&page=1&resultsPerPage=150&q=${keywords12}`).then(r => r.json());
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      if (allData && allData.results) {
        allData.results.forEach(item => {
          //console.log('item',item);
          let data=item;
          const hiddenDataDiv = document.createElement('div');
          hiddenDataDiv.id = 'jdCustomDivJSONData_inner_'+item.sku;
          hiddenDataDiv.style.display = 'none';
          hiddenDataDiv.textContent = JSON.stringify(data);
          const jdCustomDivJSONDataMain = document.querySelector('div#jdCustomDivJSONData');
          jdCustomDivJSONDataMain.appendChild(hiddenDataDiv);
        });
      }
    },inputs);
  };
  await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'petpost',
    domain: 'petpost.com.au',
    url: 'https://www.petpost.com.au/search?q={searchTerms}',
    loadedSelector: 'div#root>section>div',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
