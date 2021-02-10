const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'thebrick',
    transform,
    domain: 'thebrick.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const searchUrl = await context.evaluate(async () => {
      return document.URL;
    });
    console.log(searchUrl + ' is search url');
    async function paginate () {
      try {
        await context.evaluate(async () => {
          // const element = document.querySelector('div[id="footer"]');
          const element = document.querySelector('footer.footer-wrapper');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
        });
        const hasNextLink = await context.evaluate((selector) => !!document.querySelector('button[class*="next-button"]'));
        if (hasNextLink) {
          await context.click('button[class*="next-button"]');
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.log(error);
      }
    }
    let length = await context.evaluate(async function () {
      return document.querySelectorAll('div[class*="_column"]').length;
    });
    let oldLength = 0;
    while (length && length !== oldLength && length <= 150) {
      oldLength = length;
      await paginate();
      length = await context.evaluate(async function () {
        return document.querySelectorAll('div[class*="_column"]').length;
      });
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    const notSearchPage = await context.evaluate(async function () {
      if (!document.URL.includes('search-results')) return true;
      return false;
    });
    if (notSearchPage) {
      console.log('not search page');
      await context.goto(searchUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      await context.evaluate(async () => {
        const element = document.querySelector('footer.footer-wrapper');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      });
    }
    //  await paginate();
    // console.log('page url is ',keywords);}
    return await context.extract(productDetails, { transform });
  },
};
