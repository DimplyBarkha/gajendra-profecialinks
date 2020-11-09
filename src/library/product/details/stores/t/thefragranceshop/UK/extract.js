
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    transform: cleanUp,
    domain: 'thefragranceshop.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const moreReviews = document.querySelector('a[ng-click*="fetchMoreReviews"]');
      // @ts-ignore
      if (moreReviews) moreReviews.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await context.evaluate(async function () {
      function addElementToDocument (id, key, value) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.setAttribute('value', key);
        catElement.innerText = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const reviewList = document.querySelectorAll('div[class*="reviewContainer"]')
        ? document.querySelectorAll('div[class*="reviewContainer"]') : [];
      if (reviewList) addElementToDocument('reviewList', reviewList.length);
      const shippingInfo = document.querySelector('div[id*="deliveryInfo"] div[class*="col"]')
      // @ts-ignore
        ? document.querySelector('div[id*="deliveryInfo"] div[class*="col"]').innerText : '';
      addElementToDocument('shippingInfo', '', shippingInfo);
    });

    await context.extract(productDetails);
  },
};
