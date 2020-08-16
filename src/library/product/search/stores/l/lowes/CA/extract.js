const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  inputs: [
    {
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'Keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'results',
      description: 'the minimum number of results required',
      type: 'number',
    },
  ],
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    transform,
    domain: 'lowes.ca',
    zipcode: '',
  },
  implementation: async ({ keywords },
    { transform },
    context,
    { productDetails, store },
  ) => {
    async function myGotoFun (allUrls) {
      const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);
      let collected = 0;
      console.log('Inside the goto function------------------>');
      for (let index = 0; index < allUrls.length; index++) {
        const element = allUrls[index];
        if (element) {
          console.log('hrefsss------>', element);
          await context.goto(element, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
          const collectedResults = await context.extract(productDetails, { transform }, 'APPEND');
          const count = length(collectedResults);
          if (count === 0) {
            // no results
            break;
          }
          collected += count;
          console.log('collected ', collected);
          if (collected > 150) {
            break;
          }
        }
      }
    }
    let allUrls = [];
    if (keywords === 'Dyson') {
      allUrls = await context.evaluate(async function () {
        const linkArray = [];
        const allLinks = document.querySelectorAll('div[class="description"] + a');
        allLinks && allLinks.length && allLinks.forEach(link => {
          linkArray.push(link.href);
        });
        console.log('array---->', linkArray);
        return linkArray;
      });
      console.log('---------------------->', allUrls);
      await myGotoFun(allUrls);
    } else {
      return await context.extract(productDetails, { transform });
    }
  },
};
