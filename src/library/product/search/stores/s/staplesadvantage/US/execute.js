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
  // after the search results page and checking loadedSelector and noResultsXPath
  // the extractor goes to the logging in page
  await context.goto(loginUrl);
  // the popup is visible after a moment -> delaying the removal
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div.truste_box_overlay') !== null;
  });
    // when the popup is present it returns undefined, when not - null
  if (isPopupPresent) {
    await context.evaluate(() => {
      document.querySelector('div.truste_box_overlay').remove();
      document.querySelector('div.truste_overlay').remove();
    });
  }
  // checking if the extractor is on the logging in page
  // when the user is logged in the extractor will be redirected to the homepage
  const isUserLogged = await context.evaluate(async () => {
    const currentUrl = window.location.href;
    return !currentUrl.includes('idm');
  });
    // when the user is not logged in, the extractor fills out the form
  if (!isUserLogged) {
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
  }
  // logging in takes a moment and reloads the page, then goes to the homepage
  await context.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // going to the search results page
  await context.goto(url);

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
