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
    const esToEn = {
      enero: 'january',
      febrero: 'february',
      marzo: 'arch',
      abril: 'april',
      mayo: 'may',
      junio: 'june',
      julio: 'july',
      agosto: 'august',
      septiembre: 'september',
      octubre: 'october',
      noviembre: 'november',
      diciembre: 'december',
    };
    Array.from(document.querySelectorAll('div[id*="review_list"] > div[data-hook="review"]')).forEach((review) => {
      let dateFlag = true;
      if (review.querySelector('span[data-hook*="review-date"]')) {
        review.querySelector('span[data-hook*="review-date"]').innerText = review.querySelector('span[data-hook*="review-date"]').innerText.replace(/de\s+/g, '');
        const month = review.querySelector('span[data-hook*="review-date"]').textContent.match(/([^\s]+)\s*[^\s]+$/) && review.querySelector('span[data-hook*="review-date"]').textContent.match(/([^\s]+)\s*[^\s]+$/)[1];
        if (month) {
          const engMonth = esToEn[month];
          review.querySelector('span[data-hook*="review-date"]').innerText = review.querySelector('span[data-hook*="review-date"]').innerText.replace(month, engMonth);
        }
        const reviewDate = new Date(review.querySelector('span[data-hook*="review-date"]').textContent).setHours(0, 0, 0, 0);
        const date = new Date(inputDate).setHours(0, 0, 0, 0);
        dateFlag = (reviewDate - date) >= 0;
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
