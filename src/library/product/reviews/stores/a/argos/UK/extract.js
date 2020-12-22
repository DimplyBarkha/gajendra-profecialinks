const { transform } = require('./format');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    transform,
    domain: 'argos.co.uk',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    // const basicDetails = await context.evaluate(() => {
    //   const productRows = document.querySelectorAll('div[class="css-1dbjc4n"] > div[class="css-1dbjc4n r-18u37iz r-tzz3ar"]');
    //   let gotoUrl = '';
    //   let skuId = '';
    //   if (productRows && productRows.length > 0) {
    //     const products = productRows[0].querySelectorAll('div[class="css-1dbjc4n r-18u37iz r-tzz3ar"]');
    //     if (products && products.length > 0) {
    //       const productLink = products[0].querySelector('a');
    //       if (productLink) {
    //         const productUrl = productLink.getAttribute('href');
    //         skuId = window.location.href.split('?')[1].split('=')[1];
    //         gotoUrl = `https://www.cvs.com${productUrl}?skuid=${skuId}`;
    //       }
    //     }
    //   }
    //   return { gotoUrl, skuId };
    // });

    // if (basicDetails.gotoUrl) {
    //   await context.goto(basicDetails.gotoUrl, { timeout: 60000 });
    // }

    // await new Promise(resolve => setTimeout(resolve, 10000));
    const cookieCheck = await context.evaluate(async () => {
      const cookie = document.querySelector('div[class*="consent_prompt explicit_consent"]') ? document.querySelector('div[class*="consent_prompt explicit_consent"]') : '';
      if (cookie && cookie.innerHTML.length) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.waitForSelector('div[class*="consent_prompt explicit_consent"]');
        await context.click('button[id*="consent_prompt_submit"]');
      }
    });

    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.click('a[data-test*="reviews-flag-link"]');
    await context.waitForSelector('div[id*="reviews"]');

    const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
      const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
      return (new Date(reviewDate).getTime() > timestamp);
    };

    const totalReviews = await context.evaluate(() => {
      let totalReviews = 0;
      const totalReviewsElement = document.querySelector('div[class*="cFzgQO"] div:nth-child(1) p');
      if (totalReviewsElement) {
        const totalReviewsStr = totalReviewsElement.textContent.split(' ')[0];
        totalReviews = parseInt(totalReviewsStr, 10);
      }
      return totalReviews;
    });

    const latestReviewDate = await context.evaluate(() => {
      let reviewDate = '';
      const reviewElements = document.querySelectorAll('div[data-test="review-item"]');
      if (reviewElements && reviewElements.length > 0) {
        const reviewDateElement = reviewElements[0].querySelector('time[class*="jbcxwt"][datetime]');
        if (reviewDateElement) {
          const pattern = /([0-9]+-[0-9]+-[0-9]+)/i;
          const results = reviewDateElement.dateTime.match(pattern);
          if (results && results.length > 0) {
            reviewDate = results[1];
          }
        }
      }
      // reviewDate = reviewDate.split('-').reverse().join('/');
      return reviewDate;
    });

    const getLastReviewDate = () => {
      return context.evaluate(() => {
        let reviewDate = '';
        const reviewElements = document.querySelectorAll('div[data-test="review-item"]');
        if (reviewElements && reviewElements.length > 0) {
          const reviewDateElement = reviewElements[reviewElements.length - 1].querySelector('time[class*="jbcxwt"][datetime]');
          if (reviewDateElement) {
            const pattern = /([0-9]+-[0-9]+-[0-9]+)/i;
            const results = reviewDateElement.dateTime.match(pattern);
            if (results && results.length > 0) {
              reviewDate = results[1];
            }
          }
        }
        // reviewDate = reviewDate.split('-').reverse().join('/');
        return reviewDate;
      });
    };

    const getAllReviewsCount = async () => {
      return context.evaluate(() => {
        const allReviews = document.querySelectorAll('div[data-test="review-item"]');
        return allReviews.length;
      });
    };

    let allReviewsCount = await getAllReviewsCount();
    let lastReviewDate = await getLastReviewDate();
    while (checkIfReviewIsFromLast30Days(latestReviewDate, lastReviewDate) && allReviewsCount < totalReviews) {
      await context.click('button[data-test*="show-x-more-reviews-button"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      allReviewsCount = await getAllReviewsCount();
      lastReviewDate = await getLastReviewDate();
    }

    // await context.evaluate(() => {
    //   const addHiddenDiv = (id, content) => {
    //     const newDiv = document.createElement('div');
    //     newDiv.id = id;
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     document.body.appendChild(newDiv);
    //   };

    // const schemaJsonSscript = document.querySelector('script[id="schema-json-ld"]');
    // if (schemaJsonSscript) {
    //   const schemaJson = JSON.parse(schemaJsonSscript.textContent);
    //   const brand = schemaJson[0].brand;
    //   if (brand) {
    //     addHiddenDiv('ii_brand', brand);
    //   }
    // }
    // if (basicDetails.skuId) {
    //   addHiddenDiv('ii_sku', basicDetails.skuId);
    // }
    // if (basicDetails.gotoUrl) {
    //   addHiddenDiv('ii_productUrl', basicDetails.gotoUrl);
    // }
    // });

    // const readMoreCount = await context.evaluate(async () => {
    //   const readMoreButtons = document.querySelectorAll('div[class="css-901oao r-jw6ls8"]');
    //   if (readMoreButtons && readMoreButtons.length > 0) {
    //     readMoreButtons.forEach((button, index) => {
    //       if (button.textContent.indexOf('Read More') >= 0) {
    //         button.setAttribute('id', `ii_ReadMore${index}`);
    //       }
    //     });
    //     return readMoreButtons.length;
    //   }
    //   return 0;
    // });

    // if (readMoreCount) {
    //   for (let i = 0; i < readMoreCount; i++) {
    //     await context.click(`div[id="ii_ReadMore${i}"]`);
    //   }
    // }

    await new Promise(resolve => setTimeout(resolve, 5000));

    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
