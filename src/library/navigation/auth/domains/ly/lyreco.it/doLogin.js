module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'lyreco.it',
    usernameSelector: '#j_username',
    passwordSelector: '#j_password',
    buttonSelector: '#right_01 button[class*=btn_lyreco]',
    loggedInSelector: null,
    country: 'IT',
    store: 'lyreco',
    zipcode: '',
  },
  implementation: async function implementation (
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
      }, { timeout: 10000 }, loggedInSelector);
    }
    try {
      await context.waitForSelector('#btn_lyreco_small');
    } catch (err) {
      console.log('No user is logged in using same credentials elsewhere');
    }
    const approveButton = await context.evaluate(() => {
      return Boolean(document.querySelector('button#btn_lyreco_small[onclick*=force]'));
    });
    if (approveButton) {
      await context.click('#btn_lyreco_small.btn_yellow');
      console.log('waiting for navigation be like......');
    }
    try {
      await context.waitForSelector('#keyWord');
    } catch (err) {
      console.log('Home page not loaded');
    }
  },
};
