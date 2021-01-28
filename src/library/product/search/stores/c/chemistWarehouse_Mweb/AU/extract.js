const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  {results  = 150 },
  parameters,
  context,
  dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    let nextLinkSelector = null;
    let categoryNextLinkSelector = null;

    nextLinkSelector = await context.evaluate(() => 
      !!document.querySelector('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button')
    );

    categoryNextLinkSelector = await context.evaluate(() => 
      !!document.querySelector('div[class*="pager-list"] button[class*="active pager__button"] + button')
    );

    async function nextLink() {
      nextLinkSelector = await context.evaluate(() => 
        !!document.querySelector('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button')
      );

      let count = 0;
      while(nextLinkSelector){
        count += await context.evaluate(() => {
          return document.querySelectorAll('div.search__result__product').length;
        });

        if(count <= 190){
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
          await context.click('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button');
          await new Promise(resolve => setTimeout(resolve, 2000));
          nextLinkSelector = await context.evaluate(() => 
            !!document.querySelector('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button')
          );
        } else {
          break;
        }
      }
    }

    async function categoryNextLink() {
      categoryNextLinkSelector = await context.evaluate(() => 
        !!document.querySelector('div[class*="pager-list"] button[class*="active pager__button"] + button')
      );

      let count = 0;
      while(categoryNextLinkSelector){
        count += await context.evaluate(() => {
          return document.querySelectorAll('div.product').length;
        });

        if(count <= 190){
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
          await context.click('div[class*="pager-list"] button[class*="active pager__button"] + button');
          await new Promise(resolve => setTimeout(resolve, 2000));
          categoryNextLinkSelector = await context.evaluate(() => 
            !!document.querySelector('div[class*="pager-list"] button[class*="active pager__button"] + button')
          );
        } else {
          break;
        }
      }
    }

    if(nextLinkSelector){
      await nextLink();
    }

    if(categoryNextLinkSelector){
      await categoryNextLink();
    }
    return await context.extract(productDetails, { transform });
}