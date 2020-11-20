const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
  ) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function arrBtn (){
    return await context.evaluate(async () => {
      let paginations = document.querySelectorAll('div.search__result__pager-list');
      // @ts-ignore
      let upperPagination = paginations ? paginations.querySelectorAll('button') : '';
      let btnarr = upperPagination ? upperPagination : '';
      console.log('Length of all', btnarr.length);
      console.log('btnarr: ', btnarr);
      return btnarr ? btnarr : [];
    });
  }
  console.log('buttons: ', arrBtn());
  // await context.evaluate(async () => {
  //   let paginations = document.querySelectorAll('div.search__result__pager-list');
  //   let firstPagination = paginations ? paginations[0] : '';
  //   // @ts-ignore
  //   let button = firstPagination ? firstPagination.querySelectorAll('button') : '';
  //   for (let index = 0; index < button.length; index++) {
  //     const element = button[index];
  //     console.log('element: ', element);
  //     if(element.classList.contains('search__result__pager-button--active')){
  //       console.log("llllllllllll"+element)
  //       element.nextSibling.click();
        //await context.extract(productDetails, { transform }, { type: 'APPEND' });
  //     }
  //   }
  // });
  return await context.extract(productDetails, { transform });
  }
