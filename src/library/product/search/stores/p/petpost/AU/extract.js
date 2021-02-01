// @ts-nocheck
const {transform}=require('../AU/format')
/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('inputs.keywords', inputs.keywords);
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}
/*async function implementation (
  inputs,
  parameters,
  context,
  dependencies){
    console.log('inputs before',inputs);
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('inputs after',inputs);
    console.log('params', parameters);
    const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs.keywords:',inputs);
  console.log('inputs are got');
  const keywords1=inputs.keywords;
  const applyScroll = async function (kw) {
    console.log('kw kw',kw);
    await context.evaluate(async function (kw) {
      console.log('kw kw kw',kw);
      let scrollTop = 0;
     /* while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        console.log('calling applyScroll evaluate-----------', window);
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }*/
      
      /*let tmpInput=encodeURIComponent(keywords1)
      const allData = await fetch(`https://api.searchspring.net/api/search/search.json?siteId=14dsyu&resultsFormat=native&page=1&resultsPerPage=150&q=${tmpInput}`).then(r => r.json());
      let data;
      if (allData && allData.results) {
        data = allData.results.map(({ id, url, }) => ({ id, url }));
        const hiddenDataDiv = document.createElement('div');
        hiddenDataDiv.id = 'product-url';
        hiddenDataDiv.style.display = 'none';
        hiddenDataDiv.textContent = JSON.stringify(data);
        document.body.appendChild(hiddenDataDiv);
      }*/
    /*});
  };
  await applyScroll(inputs.keywords);

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  return await context.extract(productDetails, { transform });
}*/

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'petpost',
    transform,
    domain: 'petpost.com.au',
    zipcode: '',
  },
};
