async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.staplesadvantage.com/search?term={searchTerms}'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );
  const loginUrl = 'https://www.staplesadvantage.com/idm';
  const credentials = {
    accountNumber: '1021401',
    loginUserId: 'LLAWSON',
    loginUserPassword: 'Norris2017',
  };

  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(
      function (sel, xp) {
        return Boolean(
          document.querySelector(sel) ||
            document
              .evaluate(
                xp,
                document,
                null,
                XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
                null,
              )
              .iterateNext(),
        );
      },
      { timeout: 60000 },
      parameters.loadedSelector,
      parameters.noResultsXPath,
    );
  }
  // checking if a user is logged in
  const isUserLogged = await context.evaluate(async () => {
    return document.querySelector('div[aria-label="Search Results"] div[class*="grid__row"] > div span[class*="_price"]') !== null;
  });

  // when the user is not logged in, the extractor goes to the login page and fills out the form
  if (!isUserLogged) {
    await context.goto(loginUrl);
    // the popup is visible after a moment -> delaying the removal
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const isPopupPresent = await context.evaluate(async () => {
      return document.querySelector('div.truste_box_overlay') !== null;
    });
    if (isPopupPresent) {
      await context.evaluate(() => {
        document.querySelector('div.truste_box_overlay').remove();
        document.querySelector('div.truste_overlay').remove();
      });
    }
    // filling in the form
    await context.evaluate(async () => {
      const linkToOldForm = document.querySelector('span > a.SBALogin__twoFieldClickhere');
      if (linkToOldForm) {
        // @ts-ignore
        linkToOldForm.click();
      }
    });
    const isAccountNumberFilledIn = await context.evaluate(async (number) => {
      return document.querySelector('input#accountNumber').getAttribute('value') === number;
    }, credentials.accountNumber);
    if (!isAccountNumberFilledIn) await context.setInputValue('input#accountNumber', credentials.accountNumber);
    const isLoginUserIdFilledIn = await context.evaluate(async (login) => {
      return document.querySelector('input#loginUserId').getAttribute('value') === login;
    }, credentials.loginUserId);
    if (!isLoginUserIdFilledIn) await context.setInputValue('input#loginUserId', credentials.loginUserId);
    await context.setInputValue('input#loginUserPassword', credentials.loginUserPassword);

    await context.click('div#loginBtn');
    // logging in takes a moment and reloads the page, then goes to the homepage
    await context.waitForNavigation();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // going to the search results page
    await context.goto(url);
  }

  return await context.evaluate(function (xp) {
    const r = document.evaluate(
      xp,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    );
    const e = r.iterateNext();
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    domain: 'staplesadvantage.com',
    url: 'https://www.staplesadvantage.com/search?term={searchTerms}',
    loadedSelector: 'div[aria-label="Search Results"] div[class*="grid__row"] > div',
    noResultsXPath: '//p[@class="NullPage__tryAgainMessage"]',
    zipcode: '',
  },
  implementation,
};
