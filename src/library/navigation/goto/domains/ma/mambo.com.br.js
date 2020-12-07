async function implementation ({ url, zipcode, storeId }, parameters, context, dependencies) {
  await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });

  await context.waitForSelector('.pageLoading');
  let body = await context.evaluate(async function () {
    const body = document.querySelector('.pageLoading');
    if (body) return true;
    else return false;
  });
  do {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    body = await context.evaluate(async function () {
      const body = document.querySelector('.pageLoading');
      if (body) return true;
      else return false;
    });
  } while (body);
  await context.reload();
}

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mambo.com.br',
    timeout: null,
    country: 'BR',
    store: 'mambo',
    zipcode: '',
  },
  implementation,
};
