async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.staplesadvantage.com/search?term={searchTerms}'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );
  const loginUrl = 'https://www.staplesadvantage.com/idm';

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
  // the extractor goes to the logging in page
  await context.goto(loginUrl);
  // the popup is visible after a moment -> delaying the removal
  await new Promise((resolve) => setTimeout(resolve, 3000));
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
    await context.evaluate(async () => {
      document.querySelector('input#accountNumber').setAttribute('value', '1021401');
    });
    await context.click('input#loginUserId');
    // after filling in the account number input and clicking away, the page is reloaded
    // and the extractor needs to wait to fill in the rest of the inputs
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      document.querySelector('input#loginUserId').setAttribute('value', 'LLAWSON');
    });
    await context.click('input#loginUserPassword');
    await context.evaluate(async () => {
      document.querySelector('input#loginUserPassword').setAttribute('value', 'Norris2017');
    });
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
    store: 'staplesadvantage',
    domain: 'staplesadvantage.com',
    url: 'https://www.staplesadvantage.com/search?term={searchTerms}',
    loadedSelector: 'div.nested_grid_content',
    noResultsXPath: '//p[@class="NullPage__tryAgainMessage"]',
    zipcode: '',
  },
  implementation,
};
