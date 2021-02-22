const { transform } = require('./../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await context.evaluate(async function () {
    let postal_code_continue_btn =   document.getElementById('postal-code-continue');
    if(postal_code_continue_btn){
      postal_code_continue_btn.click();
    }
  });

  await context.waitForSelector('#BVRRContainer', { timeout: 10000 });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await context.evaluate(async function () {
    // const tabList = document.querySelectorAll('#tablist li');
    // if (tabList) {
    //   for (let i = 0; i < tabList.length; i++) {
    //     if (tabList[i].innerText === 'Reviews') {
    //       tabList[i].querySelector('a').click();
    //     }
    //   }
    // }
    const loadMoreButton = document.querySelector('#nav-pdp-tab-header-12 > div.row.view-more-v2 > div > input');
    if (loadMoreButton) {
      loadMoreButton.click();
    }
    try {
      await context.waitForSelector('div.bv-control-bar div.bv-dropdown button');
      document.querySelector('div.bv-control-bar div.bv-dropdown button') && document.querySelector('div.bv-control-bar div.bv-dropdown button').click();
      await context.waitForSelector('li#data-bv-dropdown-item-mostRecent');
      document.querySelector('li#data-bv-dropdown-item-mostRecent') && document.querySelector('li#data-bv-dropdown-item-mostRecent').click();
    } catch (error) {
      console.log(error);
    }
  });
  
  // let count = 0;
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // let nextLinkSelector = await context.evaluate(() => !!document.querySelector('li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next a'));
  // while (nextLinkSelector) {
  //   count += await context.evaluate(() => {
  //     return document.querySelectorAll(
  //       'ol li.bv-content-item.bv-content-top-review.bv-content-review',
  //     ).length;
  //   });

  //   console.log('here is count', count);
  //   if (count <= 150) {
  //     await context.extract(productReviews, { transform }, { type: 'APPEND' });
  //     await context.click('li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next a');
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     nextLinkSelector = await context.evaluate(() => !!document.querySelector('li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next a'));
  //   } else {
  //     break;
  //   }
  // }
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform,
    domain: 'costco.com',
    zipcode: '',
  },
  implementation,
};
