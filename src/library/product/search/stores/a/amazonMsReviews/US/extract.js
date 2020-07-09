/**
 *
 * @param { { url?: string,  id?: string, _date?: string } } inputs
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
  const { _date } = inputs
  const { productDetails } = dependencies;

  async function checkDate ( ) {
    const reviewDateRaw = document.querySelector('div[data-hook*="review"]:first-of-type span[data-hook*="review-date"]') ? document.querySelector('div[data-hook*="review"]:first-of-type span[data-hook*="review-date"]').innerText :  ''
    return  new Date(reviewDateRaw)
  }
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let url = window.location.href;
    addHiddenDiv('added-url', url);
  }
  const currentTopReviewDate = await context.evaluate(checkDate);
  const inputReviewDateLimit = new Date(_date);
  const dateDiff = +currentTopReviewDate - +inputReviewDateLimit
  if(dateDiff){
    console.log("Date",currentTopReviewDate, inputReviewDateLimit, dateDiff)
  }
  await context.evaluate(addUrl);
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMsReviews',
    transform: null,
    domain: 'amazon.com',
  },
  implementation,
};
