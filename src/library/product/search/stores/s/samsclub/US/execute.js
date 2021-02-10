
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
      let URL=`https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=1&sortKey=relevance&sortOrder=1&searchTerm=${keywords12}&clubId=6384&br=true&limit=48`;
      console.log('URL::',URL)
      const allData = await fetch(URL).then(r => r.json());
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      let slNo=0;
      if (allData && allData.payload.records) {
        if(allData.payload.numberOfRecords>0){
          allData.payload.records.forEach(item => {
            slNo++;
            //console.log('item',item);
            let data=item;
            const hiddenDataDiv = document.createElement('div');
            hiddenDataDiv.id = 'jdCustomDivJSONData_inner_'+slNo;
            hiddenDataDiv.style.display = 'none';
            hiddenDataDiv.textContent = JSON.stringify(data);
            const jdCustomDivJSONDataMain = document.querySelector('div#jdCustomDivJSONData');
            jdCustomDivJSONDataMain.appendChild(hiddenDataDiv);
          });
        }
      }
      if(slNo>47){
        const allData1 = await fetch(`https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=1&sortKey=relevance&sortOrder=1&searchTerm=${keywords12}&clubId=6384&br=true&limit=48&offset=48`).then(r => r.json());
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        if (allData && allData.payload.records) {
          if(allData.payload.numberOfRecords>0){
            allData.payload.records.forEach(item => {
              slNo++;
              //console.log('item',item);
              let data=item;
              const hiddenDataDiv = document.createElement('div');
              hiddenDataDiv.id = 'jdCustomDivJSONData_inner_'+slNo;
              hiddenDataDiv.style.display = 'none';
              hiddenDataDiv.textContent = JSON.stringify(data);
              const jdCustomDivJSONDataMain = document.querySelector('div#jdCustomDivJSONData');
              jdCustomDivJSONDataMain.appendChild(hiddenDataDiv);
            });
          }
        }
      }
      if(slNo>95){
        const allData1 = await fetch(`https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=1&sortKey=relevance&sortOrder=1&searchTerm=${keywords12}&clubId=6384&br=true&limit=48&offset=96`).then(r => r.json());
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        if (allData && allData.payload.records) {
          if(allData.payload.numberOfRecords>0){
            allData.payload.records.forEach(item => {
              slNo++;
              //console.log('item',item);
              let data=item;
              const hiddenDataDiv = document.createElement('div');
              hiddenDataDiv.id = 'jdCustomDivJSONData_inner_'+slNo;
              hiddenDataDiv.style.display = 'none';
              hiddenDataDiv.textContent = JSON.stringify(data);
              const jdCustomDivJSONDataMain = document.querySelector('div#jdCustomDivJSONData');
              jdCustomDivJSONDataMain.appendChild(hiddenDataDiv);
            });
          }
        }
      }
      if(slNo>143){
        const allData1 = await fetch(`https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=2&sortKey=relevance&sortOrder=1&searchTerm=${keywords12}&clubId=6384&br=true&limit=48&offset=144`).then(r => r.json());
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        if (allData && allData.payload.records) {
          if(allData.payload.numberOfRecords>0){
            allData.payload.records.forEach(item => {
              slNo++;
              //console.log('item',item);
              let data=item;
              const hiddenDataDiv = document.createElement('div');
              hiddenDataDiv.id = 'jdCustomDivJSONData_inner_'+slNo;
              hiddenDataDiv.style.display = 'none';
              hiddenDataDiv.textContent = JSON.stringify(data);
              const jdCustomDivJSONDataMain = document.querySelector('div#jdCustomDivJSONData');
              jdCustomDivJSONDataMain.appendChild(hiddenDataDiv);
            });
          }
        }
      }

    },inputs);
  };
  await applyScroll(context);
  console.log('======================================JD===========================================');
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));

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
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    url: 'https://samsclub.com/s/{searchTerms}',
    loadedSelector: 'div.sc-plp-layout',
    noResultsXPath: '//div[@class="sc-error-page-title"]',
  },
  implementation
};
