const { transform } = require('../format');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  const currentUrl = await context.evaluate(async function () {
    const currentUrl = window.location.href;
    return currentUrl;
  });
  await context.goto(`${currentUrl}#reviews`);
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
    const xpath = document.querySelector('div.pagination a:last-child');
    if (xpath) {
      xpath.click();
    }
  });

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const currentUrlReview = window.location.href;
    const currentUrlReviewAdd = currentUrlReview + '#reviews';
    addHiddenDiv('Added_reviewUrl', currentUrlReviewAdd);
  });
  return await context.extract(productReviews, { transform });
}
