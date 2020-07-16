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
  const { productDetails } = dependencies;
  // const { _date } = inputs;
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-url', url);
  }
  /*
   *NOTE: Use this function to include only valid date results from last page.
   *
  async function addValidDateFlag (inputDate = _date) {
    const frToEn = {
      janvier: 'january',
      février: 'february',
      mars: 'march',
      avril: 'april',
      mai: 'may',
      juin: 'june',
      juillet: 'july',
      août: 'august',
      septembre: 'september',
      octobre: 'october',
      novembre: 'november',
      décembre: 'december',
    };
    Array.from(document.querySelectorAll('div[id*="review_list"] > div[data-hook="review"]')).forEach((review) => {
      let dateFlag = true;
      if (review.querySelector('span[data-hook*="review-date"]')) {
        const month = review.querySelector('span[data-hook*="review-date"]').textContent.match(/([^\s]+)\s*[^\s]+$/) && review.querySelector('span[data-hook*="review-date"]').textContent.match(/([^\s]+)\s*[^\s]+$/)[1];
        if (month) {
          const engMonth = frToEn[month];
          review.querySelector('span[data-hook*="review-date"]').innerText = review.querySelector('span[data-hook*="review-date"]').innerText.replace(month, engMonth);
        }
        const reviewDate = new Date(review.querySelector('span[data-hook*="review-date"]').textContent);
        const date = new Date(inputDate);
        dateFlag = (reviewDate.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) >= 0;
      }
      review.setAttribute('date-flag', dateFlag.toString());
    });
  } */

  await context.evaluate(addUrl);
  // await context.evaluate(addValidDateFlag, _date);
  return await context.extract(productDetails, { type: 'APPEND' });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GLOBAL',
    store: 'amazonMsReviews',
    transform: null,
    domain: 'amazon.com',
  },
  implementation,
};
