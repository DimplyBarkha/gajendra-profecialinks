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
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
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
      
      const allData = await fetch(`https://www.sephora.com/api/catalog/search?type=keyword&q=${keywords12}&country_switch=ca&lang=en&pageSize=150&content=true&includeRegionsMap=true&page=60%C2%A4tPage=1`).then(r => r.json());
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      if (allData && allData.products) {
        allData.products.forEach(item => {
          console.log('item currentSku skuId',item.currentSku.skuId);
          item.listPrice=item.currentSku.listPrice;
          item.skuId=item.currentSku.skuId;
          console.log('item',item);
          let data=item;
          const hiddenDataDiv = document.createElement('div');
          hiddenDataDiv.id = 'jdCustomDivJSONData_inner_'+item.productId;
          hiddenDataDiv.style.display = 'none';
          hiddenDataDiv.textContent = JSON.stringify(data);
          const jdCustomDivJSONDataMain = document.querySelector('div#jdCustomDivJSONData');
          jdCustomDivJSONDataMain.appendChild(hiddenDataDiv);
        });
      }else{
        console.log('no data getting from api');
      }
    },inputs);
  };
  await applyScroll(context);
  
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 100000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);  
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
    country: 'CA',
    store: 'sephora',
    domain: 'sephora.com',
    url: 'https://www.sephora.com/search?keyword={searchTerms}',
    loadedSelector: 'div.css-1bvyrmg, e65zztl0',
    noResultsXPath: '//h1[contains(@class,"css-1wag3se") and contains(@class,"e65zztl0") and contains(text(),"0 Product results:")]',
    zipcode: '',
  },
  implementation
};
