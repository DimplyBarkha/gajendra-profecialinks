async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.staplesadvantage.com/search?term={searchTerms}'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );
  const storeIdUrl = 'https://www.staplesadvantage.com/learn/?storeId=10101';
  const loginUrl = 'https://www.staplesadvantage.com/idm';
  // extractor login credentials:
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
      { timeout: 30000 },
      parameters.loadedSelector,
      parameters.noResultsXPath,
    );
  }

  // after the search results page and checking loadedSelector and noResultsXPath
  // the extractor goes to the storeId page and then to the logging in page
  await context.goto(storeIdUrl);
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

  let goToOldLoginVersionBtnPresent = false;
  let goToOldLoginVersionBtnXpath = '//span[contains(text(),"We have simplified your sign-in experience by asking for less information! If you would rather sign in using the old experience")]//*[contains(text(),"click here")]';
  try {
    await context.waitForXPath(goToOldLoginVersionBtnXpath);
    goToOldLoginVersionBtnPresent = true;
  } catch(err) {
    console.log('got some error while waiting for this go to older version btn', err.message);
    try {
      await context.waitForXPath(goToOldLoginVersionBtnXpath);
      goToOldLoginVersionBtnPresent = true;
    } catch(err) {
      console.log('got some error while waiting for this go to older version btn, again', err.message);
    }
  }

  console.log('goToOldLoginVersionBtnPresent', goToOldLoginVersionBtnPresent);
  if(goToOldLoginVersionBtnPresent) {
    await context.evaluate(async (goToOldLoginVersionBtnXpath) => {
      console.log('neeed to click this', goToOldLoginVersionBtnXpath);
      let elm = document.evaluate(goToOldLoginVersionBtnXpath, document, null, 7, null);
      if(elm && elm.snapshotLength > 0) {
        let thisBtn = elm.snapshotItem(0);
        if(thisBtn) {
          thisBtn.click();
          console.log('btn clicked');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }, goToOldLoginVersionBtnXpath);
  }
    // when the user is not logged in, the extractor fills out the form
    console.log('isUserLogged', isUserLogged);
  if (!isUserLogged) {
    const isAccountNumberFilledIn = await context.evaluate(async (number) => {
      let inpAccNumIsNum = false;
      let elm = document.querySelector('input#accountNumber');
      if(elm) {
        if(elm.getAttribute('value') === number) {
          inpAccNumIsNum = true;
        }
      }
      return inpAccNumIsNum;
    }, credentials.accountNumber);
    console.log('isAccountNumberFilledIn',isAccountNumberFilledIn);
    if (!isAccountNumberFilledIn) {
      try {
        await context.setInputValue('input#accountNumber', credentials.accountNumber);
      } catch(err) {
        console.log('got some error for acc num', err.message);
      }
    } 
    const isLoginUserIdFilledIn = await context.evaluate(async (login) => {
      let userIdHasValue = false;
      let elm = document.querySelector('input#loginUserId');
      if(elm) {
        if(elm.getAttribute('value') === login) {
          userIdHasValue = true;
        }
      }
      return userIdHasValue;
      // return document.querySelector('input#loginUserId').getAttribute('value') === login;
    }, credentials.loginUserId);
    console.log('isLoginUserIdFilledIn', isLoginUserIdFilledIn);
    if (!isLoginUserIdFilledIn) {
      try {
        await context.setInputValue('input#loginUserId', credentials.loginUserId);
      } catch(err) {
        console.log('got some error for login user id', err.message)
      }
      
    }

    try {
      await context.setInputValue('input#loginUserPassword', credentials.loginUserPassword);
    } catch(err) {
      console.log('got some error while checking for pswd', err.message);
    }
    
    try {
      await context.click('div#loginBtn');
    } catch(err) {
      console.log('got some error while checking with login btn', err.message);
    }
    
  }
  // logging in takes a moment and reloads the page, then goes to the homepage
  await context.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // going to the search results page
  await context.goto(url, { timeout: 50000 });

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
