
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'shipt_heb_78414',
    domain: 'shop.shipt.com',
    url: 'https://shop.shipt.com/search?query={searchTerms}',
    loadedSelector: 'ul[data-test="ProductGrid-list"] > li img',
    noResultsXPath: '//h2[contains(@class, "SearchEmptyState") and contains(text(), "no results were found")]',
    zipcode: '78414',
  },
  // implementation: async (
  //   inputs,
  //   { url, loadedSelector, noResultsXPath },
  //   context,
  //   dependencies,
  // ) => {
  //   const { keywords, query } = inputs;

  //   // logging in
  //   const loginUrl = 'https://shop.shipt.com/login';
  //   const credentials = {
  //     username: 'julia.lojek-td@partner.import.io',
  //     password: 'Import1!',
  //   };

  //   await dependencies.goto({ ...inputs, url: loginUrl });

  //   const isUsernameInputPresent = await context.evaluate(async () => {
  //     return document.querySelector('input#username') !== null;
  //   });
  //   const isPasswordInputPresent = await context.evaluate(async () => {
  //     return document.querySelector('input#password') !== null;
  //   });
  //   const isLoginButtonPresent = await context.evaluate(async () => {
  //     return document.querySelector('button[data-test="LoginForm-log-in-button"]') !== null;
  //   });

  //   if (isUsernameInputPresent && isPasswordInputPresent && isLoginButtonPresent) {
  //     await context.setInputValue('input#username', credentials.username);
  //     await context.setInputValue('input#password', credentials.password);
  //     await context.click('button[data-test="LoginForm-log-in-button"]');
  //     await context.waitForNavigation();
  //   }

  //   // choose correct address and store
  //   const isAddressButtonPresent = await context.evaluate(async () => {
  //     return document.querySelector('button[data-test="ProductSearchAutocomplete-storeView"]') !== null;
  //   });
  //   if (isAddressButtonPresent) {
  //     await context.click('button[data-test="ProductSearchAutocomplete-storeView"]');
  //     await context.waitForSelector('button#SelectAddress-select');
  //     await context.click('button#SelectAddress-select');
  //     await context.evaluate(async () => {
  //       const correctAddressOption = document
  //         .evaluate(
  //           '//form[@data-test="ChooseStore-form"]//ul/li[contains(text(), "78414")]',
  //           document,
  //           null,
  //           XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
  //           null,
  //         )
  //         .iterateNext();
  //       // @ts-ignore
  //       correctAddressOption.click();
  //     });
  //     await context.waitForSelector('div[data-test="ChooseStore-delivery-store"] > div[aria-label="H-E-B"]');
  //     await context.click('div[data-test="ChooseStore-delivery-store"] > div[aria-label="H-E-B"]');
  //     await context.waitForXPath('//body[//header and not(//div[@data-test="ChooseStore-delivery-store"])]');
  //   }

  //   // go to search results
  //   const destinationUrl = url
  //     .replace('{searchTerms}', encodeURIComponent(keywords))
  //     .replace('{queryParams}', query);
  //   await dependencies.goto({ ...inputs, url: destinationUrl });

  //   if (loadedSelector) {
  //     await context.waitForFunction(function (sel, xp) {
  //       return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //     }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  //   }
  //   console.log(`noResultsXPath: ${noResultsXPath}`);
  //   return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
  // },
};
