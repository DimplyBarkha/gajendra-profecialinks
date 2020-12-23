
const { transform } = require('./shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com',
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
  try {
    await context.waitForSelector('div.country-selection > a.us-link', { timeout: 10000 });
  } catch (e) {
    console.log('country not found');
  }

  await context.evaluate(async function () {
    const countrySelect = document.querySelector('div.country-selection > a.us-link');
    if (countrySelect) {
      countrySelect.click();
    }
  });

  // try {
  //   await context.waitForSelector('div.country-selection > a.us-link', { timeout: 10000 });
  // } catch (e) {
  //   console.log('country selector not found');
  // }

  try {
    await context.waitForSelector('a.see-all-reviews', { timeout: 10000 });
  } catch (e) {
    console.log('review selector not found');
  }

  await context.evaluate(async function () {
    const reviewAll = document.querySelector('a.see-all-reviews');
    if (reviewAll) {
      reviewAll.click();
    }
  });

  try {
    await context.waitForSelector('a.see-all-reviews', { timeout: 10000 });
  } catch (e) {
    console.log('review selector not found');
  }
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('reviewUrl_value', url);
  }
  await context.evaluate(addUrl);

  return await context.extract(productReviews, { transform });
}
