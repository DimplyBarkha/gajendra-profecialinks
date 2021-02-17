async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform, urlTemplate, resultsCountSelector, numberResultPerPage, regExpForIdFromUrl } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;
  const helper = new Helpers(context);

  try {
    await context.waitForSelector('div#Cookie', { timeout: 5000 });
  } catch (e) {
    console.log('cookies not loaded');
  }

  await context.evaluate(async function () {
    if (document.querySelector('div#Cookie')) {
      document.querySelector('button#ok_col').click();
    }
    if (document.querySelector('div.btns button.btnf-yes')) {
      document.querySelector('div.btns button.btnf-yes').click();
    }
    if (document.querySelector('div#popup_image_61')) {
      document.querySelector('div#popup_image_61 button').click();
    }
    if (document.querySelector('input#juminsag')) {
      document.getElementById('juminsag').value = '19840101';
      if (document.querySelector('button#entrance')) {
        document.querySelector('button#entrance').click();
      }
    }
  });

  await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });

  try {
    await context.waitForSelector(resultsCountSelector, { timeout: 10000 });
  } catch (e) {
    console.log('review count is not loaded');
  }

  const resultsCount = await context.evaluate((resultsCountSelector) => {
    if (document.querySelector(resultsCountSelector)) {
      const reviewCount = document.querySelector(resultsCountSelector).textContent;
      return Number(reviewCount.replace(/,/g, ''));
    } else {
      return 0;
    }
  }, resultsCountSelector);

  if (resultsCount > 0) {
    const totalPages = Math.ceil(Number(resultsCount) / numberResultPerPage);

    const currentUrl = await context.evaluate(() => {
      return window.location.href;
    });
    const urlArray = [];
    const currentUrlTemplate = currentUrl + '?page={page}';

    for (let i = 1; i <= totalPages; i++) {
      urlArray.push(currentUrlTemplate
        .replace('{page}', i));
    }

    await helper.addArrayToDocument('my-urls', urlArray);
    await helper.addItemToDocument('my-results-count', resultsCount);
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    urlTemplate: null,
    resultsCountSelector: 'div.review_topicon a span',
    numberResultPerPage: 10,
    regExpForIdFromUrl: null,
    transform: null,
    domain: 'discoverglo.co.kr',
    zipcode: '',
  },
  implementation,
};
