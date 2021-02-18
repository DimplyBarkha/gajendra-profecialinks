const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  await context.evaluate(async function () {
    const tabList = document.querySelectorAll('#tablist li');
    if (tabList) {
      for (let i = 0; i < tabList.length; i++) {
        if (tabList[i].innerText === 'Reviews') {
          tabList[i].querySelector('a').click();
        }
      }
    }
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
