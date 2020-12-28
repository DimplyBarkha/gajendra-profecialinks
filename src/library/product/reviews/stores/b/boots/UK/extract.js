const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
      const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
      return (new Date(reviewDate).getTime() > timestamp);
    };

    const totalReviews = await context.evaluate(() => {
      let totalReviews = 0;
      const totalReviewsElement = document.querySelector('span[itemprop="reviewCount"]');
      if (totalReviewsElement) {
        totalReviews = parseInt(totalReviewsElement.textContent, 10);
      }
      return totalReviews;
    });

    const getReviewDate = position => {
      return context.evaluate(position => {
        let reviewDate = '';
        const reviewSelector = `li[itemprop="review"]:${position}-of-type meta[itemprop="dateCreated"]`;
        const reviewElement = document.querySelector(reviewSelector);
        if (reviewElement) {
          reviewDate = reviewElement.getAttribute('content');
        }
        return reviewDate;
      }, position);
    };

    const getAllReviewsCount = async () => {
      return context.evaluate(() => {
        const allReviews = document.querySelectorAll('li[itemprop="review"]');
        return allReviews.length;
      });
    };

    let allReviewsCount = await getAllReviewsCount();
    if (allReviewsCount > 0) {
      const latestReviewDate = await getReviewDate('first');
      let lastReviewDate = await getReviewDate('last');
      while (checkIfReviewIsFromLast30Days(latestReviewDate, lastReviewDate) && allReviewsCount < totalReviews) {
        await context.click('button[class*="bv-content-btn-pages-load-more"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        allReviewsCount = await getAllReviewsCount();
        lastReviewDate = await getReviewDate('last');
      }
    }

    try {
      await context.waitForSelector('input[id*="ProductId"]');
    } catch (err) {
      console.log('input[id*="ProductId"]');
    }
    await context.evaluate(() => {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };

      addHiddenDiv('ii_productUrl', window.location.href);

      const productIdElement = document.querySelector('input[id*="ProductId"]');
      if (productIdElement) {
        const value = productIdElement.getAttribute('value');
        const pattern = /([0-9]+)\.P/;
        const results = value.match(pattern);
        if (results && results.length > 0) {
          addHiddenDiv('ii_sku', results[1]);
        }
      }
    });

    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
