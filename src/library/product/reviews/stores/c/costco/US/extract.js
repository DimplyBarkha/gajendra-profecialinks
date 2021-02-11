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
  });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform: null,
    domain: 'costco.com',
    zipcode: '',
  },
  implementation,
};
