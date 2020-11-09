async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.staplesadvantage.com/search?term={searchTerms}'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );
  const storeIdUrl = 'https://www.staplesadvantage.com/learn/?storeId=10101';
  const loginUrl = 'https://www.staplesadvantage.com/idm';
  // extractor login credentials:
  const extrAccount = '1021401';
  const extrId = 'LLAWSON';
  const extrPass = 'Norris2017';

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
      { timeout: 10000 },
      parameters.loadedSelector,
      parameters.noResultsXPath,
    );
  }

  // after the search results page and checking loadedSelector and noResultsXPath
  // the extractor goes to the storeId page and then to the logging in page
  await context.goto(storeIdUrl);
  await context.goto(loginUrl);
  // the popup is visible after a moment -> delaying the removal
  // await context.waitForSelector('div.truste_box_overlay', { timeout: 3000 });
  await new Promise(resolve => setTimeout(resolve, 3000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div.truste_box_overlay');
  });
  // when the popup is present it returns undefined, when not - null
  if (isPopupPresent !== null) {
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
    // filling in the inputs only works after clicking them first
    await context.click('input#accountNumber');
    await context.evaluate(async (account = extrAccount) => {
      document.querySelector('input#accountNumber').setAttribute('value', account);
    }, extrAccount);
    await context.click('input#loginUserId');
    // after filling in the account number input and clicking away, the page is reloaded
    // and the extractor needs to wait to fill in the rest of the inputs
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await context.evaluate(async (userId = extrId) => {
      document.querySelector('input#loginUserId').setAttribute('value', userId);
    }, extrId);
    await context.click('input#loginUserPassword');
    await context.evaluate(async (pass = extrPass) => {
      document.querySelector('input#loginUserPassword').setAttribute('value', pass);
    }, extrPass);
    // clicking outside the form after filling it out
    // then clicking the log in button
    await context.click('section[aria-label="Contact us"]');
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
    store: 'staplesadvantage_10101',
    domain: 'staplesadvantage.com',
    url: 'https://www.staplesadvantage.com/search?term={searchTerms}',
    loadedSelector: 'div.nested_grid_content',
    noResultsXPath: '//p[@class="NullPage__tryAgainMessage"]',
    zipcode: '10101',
  },
  implementation,
};
