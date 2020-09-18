module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'thegoodguys.com.au',
    timeout: 60000,
    country: 'AU',
    store: 'thegoodguys',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {
    await context.goto(`${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`, { timeout, waitUntil: 'load', checkBlocked: true });
    const newUrl = await context.evaluate(function (url) {
      const isSelector = document.querySelector('div.dyson.dyson-content');
      if (isSelector) {
        return 'https://www.thegoodguys.com.au/SearchDisplay?categoryId=&storeId=900&catalogId=30000&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&orderBy=0&pageSize=60&searchTerm=%60dyson%60';
      }
    }, url);
    url = newUrl || url;
    await context.goto(`${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
