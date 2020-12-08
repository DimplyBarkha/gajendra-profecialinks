const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    transform: cleanUp,
    domain: 'bebitus.com',
    zipcode: '',
  },
  implementation
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async function () {
     var loadMore = document.evaluate('//div[@class="ratings-bazaarvoice-overlay"][contains(@style,"display: none;")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (!loadMore) {
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      var reviewButton = document.querySelector('div.ratings-list-preselected div.ratings-list-button');
      if (reviewButton) {
        // @ts-ignore
        reviewButton.click();
        console.log('clicked');
        reviewButton.remove();
        await timeout(2000);
        var removeElement = document.querySelector('div.ratings-list.ratings-list-preselected')
        removeElement.remove();
      }
      // await context.waitForSelector('li.bv-content-pagination-buttons-item-next');
    } else {
      console.log('already open');
    }
   
  });

const { transform } = parameters;
const { productReviews } = dependencies;
return await context.extract(productReviews, { transform});
}