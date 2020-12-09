async function implementation ({ url, zipcode, storeId }, parameters, context, dependencies) {
  // await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true, captureRequests: true });

  // await context.waitForSelector('.pageLoading');

  // do {
  //   await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  //   body = await context.evaluate(async function () {
  //     const body = document.querySelector('.pageLoading');
  //     if (body) return true;
  //     else return false;
  //   });
  // } while (body);
  // await context.reload();
  await context.goto(url, {
    block_ads: false,
    load_all_resources: true,
    images_enabled: true,
    timeout: 100000,
    waitUntil: 'load',
  });
  await context.evaluate(async function () {
    function addEmptyDiv () {
      const div = document.createElement('div');
      div.id = 'emptySearch';
      document.querySelector('body').appendChild(div);
    }
    const text = document.querySelector('body').innerText;
    const jsonText = JSON.parse(text);
    if (jsonText.code === 3001 || !jsonText.products) {
      addEmptyDiv();
    }
  });
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
