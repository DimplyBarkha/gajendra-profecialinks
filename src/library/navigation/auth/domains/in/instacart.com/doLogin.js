
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'instacart.com',
    usernameSelector: '#nextgen-authenticate\\.all\\.log_in_email',
    passwordSelector: '#nextgen-authenticate\\.all\\.log_in_password',
    buttonSelector: '.rmq-a5d52242 div:nth-child(6) button',
    loggedInSelector: '.css-mtzz8n',
    country: 'US',
    store: 'instacart_publix',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { username, password } = inputs;
    const { usernameSelector, passwordSelector, buttonSelector, loggedInSelector } = parameters;
    // alert("username "+username);
    await context.click('button[type="button"]');
    // console.log("button clicked");
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
    var userName = username.value;
    console.log('Username' + username);
    // var userName = (<HTMLInputElement>document.getElementById('#nextgen-authenticate.all.log_in_email')).value = 'panchal.drmita85@yahoo.com';
    console.log('userName :' + userName);
    await context.setInputValue(usernameSelector, username);
    console.log('checked');
    // await context.click(buttonSelector);
    // if (loggedInSelector) {
    //   await context.waitForFunction(function (sel) {
    //     return Boolean(document.querySelector(sel));
    //   }, { timeout: 10000 }, loggedInSelector);
    // }
    await context.setInputValue(passwordSelector, password);
    await context.waitForNavigation({ timeout: 200000, waitUntil: 'load' });
    await context.click('button[type="submit"]');
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
    await context.evaluate(function () {
      document.forms[0].submit();
    });
  },
};
