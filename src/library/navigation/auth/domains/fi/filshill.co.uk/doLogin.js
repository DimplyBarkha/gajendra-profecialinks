
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'filshill.co.uk',
    usernameSelector: '#username',
    passwordSelector: '#password',
    buttonSelector: '#login_submit',
    loggedInSelector: null,
    country: 'UK',
    store: 'filshill',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
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
      }, { timeout: 10000000 }, loggedInSelector);
    }
    try {
      await context.waitForSelector('#search_submit');
    } catch (err) {
      console.log('No user logged in');
    }
    const approveButton = await context.evaluate(() => {
      return Boolean(document.querySelector('button#search_submit[onclick*=force]'));
    });
    if (approveButton) {
      await context.click('#search_submit');
      console.log('waiting for navigation be like......');
    }
    try {
      await context.waitForSelector('#username2');
    } catch (err) {
      console.log('Home page not loaded');
    }
  },
};
