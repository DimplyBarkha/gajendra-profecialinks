const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { transform } = parameters;

  const onReviewsPage = await context.evaluate(() => {
    return window.location.href.includes('/product-reviews');
  });

  if (onReviewsPage) {
    await context.waitForSelector('li[class="a-last"]', { timeout: 7000 })
      .catch(() => console.log('On last page'));
  }

  const prodObj = await context.evaluate(() => {
    try {
      if (document.querySelector('div#wayfinding-breadcrumbs_container a')) {
        let productFamily = '';
        let productRange = '';
        const nav = document.querySelectorAll('div#wayfinding-breadcrumbs_container a');
        nav.forEach(item => {
          productFamily += ' > ' + item.innerText;
        });
        productFamily = (productFamily[1] === '>') ? productFamily.substr(2).trim() : productFamily.trim();
        productRange = document.querySelector('div#wayfinding-breadcrumbs_container li:last-child a').innerText;
        return { productFamily: productFamily, productRange: productRange };
      }
    } catch (e) {
      console.log('error while getting breadcrumb');
    }
  });

  if (!onReviewsPage) {
    const reviewSuffix = await context.evaluate(() => {
      let reviewURL = '';
      if (document.querySelector('a[data-hook="see-all-reviews-link-foot"]')) {
        reviewURL = document.querySelector('a[data-hook="see-all-reviews-link-foot"]').getAttribute('href');
      }
      return reviewURL;
    });
    if (reviewSuffix) {
      await dependencies.goto(`https://www.amazon.de${reviewSuffix}`, { timeout: 20000, waitUntil: 'load' });
    } else {
      await context.evaluate(() => {
        const newDiv = document.createElement('div');
        newDiv.id = 'no_reviews';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      });
    }
  }

  await context.evaluate((prodObj) => {
    try {
      if (prodObj && prodObj.productFamily) {
        const newDiv = document.createElement('div');
        newDiv.id = 'custom_details';
        newDiv.setAttribute('productFamily', prodObj.productFamily);
        newDiv.setAttribute('productRange', prodObj.productRange);
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    } catch (e) {
      console.log('error with breadcrumb');
    }
  }, prodObj);

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
    zipcode: "''",
  },
  dependencies: {
    productReviews: 'extraction:product/reviews/stores/${store[0:1]}/${store}/${country}/extract',
    goto: 'action:navigation/goto',
  },
  implementation,
};
