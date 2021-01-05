module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'tennents',
    domain: 'new.tennentsdirect.com',
    loadedSelector: 'div.ProductTitleBar_Title',
    noResultsXPath: '//div[@class="spinner-wrap"][contains(@style, "block")] | //h1[@class="not-found"]',
    zipcode: '',
  },
  implementation: async (
    inputs,
    { loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
    const userLogin = 'promotions.tennents@tennents.com';
    const userPassword = 'Supplierdemo1!';
    const searchUrl = await dependencies.createUrl(inputs);

    await dependencies.goto({
      ...inputs,
      url: 'https://new.tennentsdirect.com/customerlogin.aspx',
    });
    const loginUrl = await context.evaluate(async () => {
      return window.location.href;
    });

    if (loginUrl.includes('customerlogin')) {
      const isUsernameInputPresent = await context.evaluate(async () => {
        return document.querySelector('input#tbUsername') !== null;
      });
      const isPasswordInputPresent = await context.evaluate(async () => {
        return document.querySelector('input#tbPassword') !== null;
      });
      const isLoginButtonPresent = await context.evaluate(async () => {
        return (
          document.querySelector('a[href*="customerloginbutton"]') !== null
        );
      });
      if (
        isUsernameInputPresent &&
        isPasswordInputPresent &&
        isLoginButtonPresent
      ) {
        await context.setInputValue('input#tbUsername', userLogin);
        await context.setInputValue('input#tbPassword', userPassword);
        await context.click('a[href*="customerloginbutton"]');
      }
    }

    await context.waitForNavigation();
    await dependencies.goto({ ...inputs, url: searchUrl });
    await context.waitForNavigation();
    const productUrl = await context.evaluate(async () => {
      const productLinkElement = document.querySelector('div.product-card a.product-image');
      return productLinkElement ? productLinkElement.getAttribute('href') : null;
    });
    if (productUrl) {
      await dependencies.goto({ ...inputs, url: productUrl });
      await context.waitForNavigation();
    }

    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(
            document.querySelector(selector) ||
            document.evaluate(
              xpath,
              document,
              null,
              XPathResult.BOOLEAN_TYPE,
              null,
            ).booleanValue
          );
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }

    return await context.evaluate(
      (xpath) =>
        !document.evaluate(
          xpath,
          document,
          null,
          XPathResult.BOOLEAN_TYPE,
          null,
        ).booleanValue,
      noResultsXPath,
    );
  },
};
