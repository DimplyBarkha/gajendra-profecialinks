const {transform}=require('./shared')
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform,
    domain: 'dm.de',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  {transform},
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
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
    }
  });
  
  
  await context.evaluate(async function () {   
    let currentSelection = document.querySelector('[id="bv-dropdown-title-reviews"]');
    currentSelection = currentSelection?document.querySelector('[id="bv-dropdown-title-reviews"]').innerText:'';
    
    if (!currentSelection.includes('Neueste')){
      document.querySelector('[id="bv-dropdown-title-reviews"]') && document.querySelector('[id="bv-dropdown-title-reviews"]').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
      document.querySelector('li[data-bv-dropdown-value="mostRecent"]') && document.querySelector('li[data-bv-dropdown-value="mostRecent"]').click();  
    }
    // const xpath = document.querySelector('span.bv-content-btn-pages-next');
    // if (xpath) {
    //   xpath.click();
    // }
  });

  return await context.extract(productReviews,{transform});
}
