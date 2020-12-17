const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform,
    domain: 'cvs.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const basicDetails = await context.evaluate(() => {
      const productRows = document.querySelectorAll('div[class="css-1dbjc4n"] > div[class="css-1dbjc4n r-18u37iz r-tzz3ar"]');
      let gotoUrl = '';
      let skuId = '';
      if (productRows && productRows.length > 0) {
        const products = productRows[0].querySelectorAll('div[class="css-1dbjc4n r-18u37iz r-tzz3ar"]');
        if (products && products.length > 0) {
          const productLink = products[0].querySelector('a');
          if (productLink) {
            const productUrl = productLink.getAttribute('href');
            skuId = window.location.href.split('?')[1].split('=')[1];
            gotoUrl = `https://www.cvs.com${productUrl}?skuid=${skuId}`;
          }
        }
      }
      return { gotoUrl, skuId };
    });

    if (basicDetails.gotoUrl) {
      await context.goto(basicDetails.gotoUrl, { timeout: 60000 });
    }

    await new Promise(resolve => setTimeout(resolve, 10000));

    const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
      const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
      return (new Date(reviewDate).getTime() > timestamp);
    };

    const totalReviews = await context.evaluate(() => {
      let totalReviews = 0;
      const totalReviewsElement = document.querySelector('div[class="css-901oao r-1khnkhu r-ubezar"]');
      if (totalReviewsElement) {
        const totalReviewsStr = totalReviewsElement.textContent.split(' ')[0];
        totalReviews = parseInt(totalReviewsStr, 10);
      }
      return totalReviews;
    });

    const getReviewDate = position => {
      return context.evaluate(position => {
        let reviewDate = '';
        const reviewSelector = `div[class="css-1dbjc4n r-ml6u3j r-qklmqi r-eqz5dr r-t60dpp r-1mi0q7o r-1ygmrgt"]:${position}-of-type div[class="css-901oao r-181bzza"]`;
        const reviewElement = document.querySelector(reviewSelector);
        if (reviewElement) {
          const pattern = /([0-9]+\/[0-9]+\/[0-9]+)/i;
          const results = reviewElement.textContent.match(pattern);
          if (results && results.length > 0) {
            reviewDate = results[1];
          }
        }
        return reviewDate;
      }, position);
    };

    const getAllReviewsCount = async () => {
      return context.evaluate(() => {
        const allReviews = document.querySelectorAll('div[class="css-1dbjc4n r-ml6u3j r-qklmqi r-eqz5dr r-t60dpp r-1mi0q7o r-1ygmrgt"]');
        return allReviews.length;
      });
    };

    let allReviewsCount = await getAllReviewsCount();
    const latestReviewDate = await getReviewDate('first');
    let lastReviewDate = await getReviewDate('last');
    while (checkIfReviewIsFromLast30Days(latestReviewDate, lastReviewDate) && allReviewsCount < totalReviews) {
      await context.click('div[aria-label="load more reviews button"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      allReviewsCount = await getAllReviewsCount();
      lastReviewDate = await getReviewDate('last');
    }

    await context.evaluate(basicDetails => {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };

      const schemaJsonSscript = document.querySelector('script[id="schema-json-ld"]');
      if (schemaJsonSscript) {
        const schemaJson = JSON.parse(schemaJsonSscript.textContent);
        const brand = schemaJson[0].brand;
        if (brand) {
          addHiddenDiv('ii_brand', brand);
        }
      }
      if (basicDetails.skuId) {
        addHiddenDiv('ii_sku', basicDetails.skuId);
      }
      if (basicDetails.gotoUrl) {
        addHiddenDiv('ii_productUrl', basicDetails.gotoUrl);
      }
    }, basicDetails);

    const readMoreCount = await context.evaluate(async () => {
      const readMoreButtons = document.querySelectorAll('div[class="css-901oao r-jw6ls8"]');
      if (readMoreButtons && readMoreButtons.length > 0) {
        readMoreButtons.forEach((button, index) => {
          if (button.textContent.indexOf('Read More') >= 0) {
            button.setAttribute('id', `ii_ReadMore${index}`);
          }
        });
        return readMoreButtons.length;
      }
      return 0;
    });

    if (readMoreCount) {
      for (let i = 0; i < readMoreCount; i++) {
        await context.click(`div[id="ii_ReadMore${i}"]`);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
