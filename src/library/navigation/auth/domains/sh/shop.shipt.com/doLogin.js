
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'shop.shipt.com',
    usernameSelector: '#username',
    passwordSelector: '#password',
    buttonSelector: 'button[data-test*=Login]',
    loggedInSelector: '#product-search-header-textbox',
    country: 'US',
    store: 'shipt_target_55449',
    zipcode: '55449',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { username, password } = inputs;
    const { usernameSelector, passwordSelector, buttonSelector, formSelector, loggedInSelector } = parameters;

    await context.setInputValue(usernameSelector, username);
    await context.setInputValue(passwordSelector, password);
    if (buttonSelector) {
      await context.click(buttonSelector);
    }

    if (formSelector) {
      await context.evaluate(function () {
        document.querySelector(formSelector).submit();
      });
    }

    if (loggedInSelector) {
      await context.waitForFunction(function (sel) {
        return Boolean(document.querySelector(sel));
      }, { timeout: 10000 }, loggedInSelector);
    }
  },
};
