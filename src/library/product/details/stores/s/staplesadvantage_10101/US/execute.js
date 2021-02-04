
async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://www.staplesadvantage.com/product_{id}'.replace(
    '{id}',
    encodeURIComponent(inputs.id),
  );
  const loginUrl = 'https://www.staplesadvantage.com/idm';
  const storeIdUrl = 'https://www.staplesadvantage.com/learn/?storeId=10101';

  await dependencies.goto({ url, zipcode: inputs.zipcode });

  // the extractor goes to the logging in page
  await context.goto(storeIdUrl);
  await context.goto(loginUrl);

  await context.waitForNavigation();
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
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const isUserLogged = await context.evaluate(async () => {
    const currentUrl = window.location.href;
    return !currentUrl.includes('idm');
  });
  // when the user is not logged in, the extractor fills out the form
  if (!isUserLogged) {
    // filling in the inputs only works after clicking them first
    await context.click('input[name="accountNumber"]');
    await context.evaluate(async () => {
      document.querySelector('input[name="accountNumber"]').setAttribute('value', '1021401');
    });
    await context.click('input[name="userId"]');
    // after filling in the account number input and clicking away, the page is reloaded
    // and the extractor needs to wait to fill in the rest of the inputs
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      document.querySelector('input[name="userId"]').setAttribute('value', 'LLAWSON');
    });

    await context.click('input[name="password"]');
    await context.evaluate(async () => {
      document.querySelector('input[name="password"]').setAttribute('value', 'Norris2017');
    });
    // clicking outside the form after filling it out
    // then clicking the log in button
    await context.click('section[aria-label="Contact us"]');
    await context.click('div[id="loginBtn"]');
  };
  // logging in takes a moment and reloads the page, then goes to the homepage
  await context.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // going to the search results page
  await context.goto(url);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // removing again loaded popup

  if (isPopupPresent !== null) {
    await context.evaluate(() => {
      document.querySelector('div.truste_box_overlay').remove();
      document.querySelector('div.truste_overlay').remove();
    });
  };

  await context.evaluate(() => {
    let descriptionFixed = '';
    const description = document.querySelectorAll('div[id="ProductDetailsSummaryWrapper"]>ul>li');
    console.log(description);
    if (description.length !== 0) {
      description.forEach(element => {
        descriptionFixed = descriptionFixed + element.textContent + ' || ';
      });
      document.querySelector('div[id="ProductDetailsSummaryWrapper"]>ul').setAttribute('description', descriptionFixed);
    }
  });

  // await context.evaluate(() => {
  //   let aggregateRating = document.querySelector('span.rating__rating_label');

  //   if (aggregateRating !== null) {
  //     aggregateRating = aggregateRating.textContent.replace('.', ',');
  //     document.querySelector('span.rating__rating_label').setAttribute('rating', aggregateRating);
  //   }
  // });

  await context.evaluate(() => {
    let descriptionFixed = '';
    const outOfAvailability = document.querySelector('div[aria-label="Notification Bubble"]');
    const description = document.querySelectorAll('div[id="ProductDetailsSummaryWrapper"]>ul>li');
    console.log(description);
    if (description.length !== 0) {
      description.forEach(element => {
        descriptionFixed = descriptionFixed + element.textContent + ' || ';
      });
      document.querySelector('div[id="ProductDetailsSummaryWrapper"]>ul').setAttribute('description', descriptionFixed);
    }
    if (outOfAvailability === null) {
      document.querySelector('div.grid__container').setAttribute('availability', 'In stock');
    } else {
      document.querySelector('div.grid__container').setAttribute('availability', 'Out of stock');
    }
  });

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
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage_10101',
    domain: 'staplesadvantage.com',
    loadedSelector: 'div.js-content>div',
    noResultsXPath: "//div[@class='errorpage__error_page']",
    zipcode: '10101',
  },
  implementation,
};
