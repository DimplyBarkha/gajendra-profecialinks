const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    const url = window.location.href;
    // const pageNum = url.match(/&page=/g) ? Number(url.replace(/.*&page=(\d+).*/, '$1')) : 0;
    // // let rank = pageNum;
    // console.log('pageNumber: ', pageNum);
    // const plength = document.querySelectorAll('span[cel_widget_id="MAIN-SEARCH_RESULTS"]');
    // const productLength = plength ? plength.length : '';
    // console.log('productLength: ', productLength);
    // let rank;
    // if (pageNum === 0) {
    //   // @ts-ignore
    //   await localStorage.setItem('noOfItems', productLength);
    // } else if (pageNum > 0) {
    //   // @ts-ignore
    //   rank = await localStorage.getItem('noOfItems');
    //   rank = (rank) ? await Number(rank) : 0;
    //   // @ts-ignore
    //   await localStorage.setItem('noOfItems', rank + productLength);
    // }
    document.querySelectorAll('span[cel_widget_id="MAIN-SEARCH_RESULTS"]').forEach(node => {
      // @ts-ignore
      // if (!rank) {
      //   rank = 1;
      // } else {
      //   ++rank;
      // }
      // addHiddenDiv(node, 'ii_rank', rank);
      addHiddenDiv(node, 'ii_url', url);
      // console.log('rank: ', rank);
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
  },
  implementation,
};
