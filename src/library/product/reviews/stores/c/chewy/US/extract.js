const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    transform,
    domain: 'chewy.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;

    const basicDetails = await context.evaluate(() => {
      let gotoUrl = '';
      let rpc = '';
      let brand = '';
      let productUrl = '';
      const pattern = /query=([0-9]+)&/i;
      const results = window.location.href.match(pattern);
      if (results && results.length > 0) {
        rpc = results[1];
      }
      const productLink = document.querySelector('article[class*="product-holder"]:nth-of-type(1) a');
      if (productLink) {
        gotoUrl = productLink.getAttribute('href');
        productUrl = `https://www.chewy.com${gotoUrl}?partNumber=${rpc}`;
        gotoUrl = gotoUrl.replace('/dp/', '/product-reviews/');
        gotoUrl = `https://www.chewy.com${gotoUrl}?partNumber=${rpc}`;
      }
      const firstProduct = document.querySelector('article[class*="product-holder"]:nth-of-type(1)');
      if (firstProduct) {
        brand = firstProduct.getAttribute('data-brand');
      }
      return { productUrl, gotoUrl, rpc, brand };
    });

    if (basicDetails.gotoUrl) {
      await context.goto(basicDetails.gotoUrl, { timeout: 30000 });
    }

    await new Promise(resolve => setTimeout(resolve, 10000));

    await context.evaluate(basicDetails => {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };

      if (basicDetails.brand) {
        addHiddenDiv('ii_brand', basicDetails.brand);
      }
      if (basicDetails.rpc) {
        addHiddenDiv('ii_sku', basicDetails.rpc);
      }
      if (basicDetails.productUrl) {
        addHiddenDiv('ii_productUrl', basicDetails.productUrl);
      }
      if (basicDetails.gotoUrl) {
        addHiddenDiv('ii_reviewUrl', basicDetails.gotoUrl);
      }
    }, basicDetails);

    const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
      const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
      return (new Date(reviewDate).getTime() > timestamp);
    };

    const getReviewDate = position => {
      return context.evaluate(position => {
        let reviewDate = '';
        const reviewDateElement = document.querySelector(`li[itemprop="review"]:${position}-of-type span[itemprop="datePublished"]`);
        if (reviewDateElement) {
          reviewDate = reviewDateElement.getAttribute('content');
        }
        return reviewDate;
      }, position);
    };

    const getNextLink = () => {
      return context.evaluate(() => {
        return document.querySelector('a[class="cw-pagination__next"]');
      });
    };

    const latestReviewDate = await getReviewDate('first');
    let lastReviewDate = await getReviewDate('last');
    let nextLink = await getNextLink();
    while (checkIfReviewIsFromLast30Days(latestReviewDate, lastReviewDate) && nextLink) {
      await context.extract(productReviews, { transform, type: 'APPEND' });
      await context.click('a[class="cw-pagination__next"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      lastReviewDate = await getReviewDate('last');
      nextLink = await getNextLink();
    }

    return await context.extract(productReviews, { transform });
  },
};
