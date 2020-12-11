const implementation = async (
  { id, url },
  { domain, loadedSelector, noResultsXPath },
  context,
  dependencies,
) => {
  const timeout = 48000;
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);

  const acceptCookies = async () => {
    try {
      await context.waitForSelector('#onetrust-accept-btn-handler', { timeout });
      await context.click('#onetrust-accept-btn-handler');
    } catch (err) {
      console.log('Cookies button didn\'t load');
    }
  };

  const waitForSelectorLoad = async () => {
    try {
      await context.waitForSelector(loadedSelector, { timeout });
    } catch (err) {
      console.log('Details section never loaded.');
    }
  };

  if (url) {
    await context.goto(url, { timeout, waitUntil: 'networkidle0' });
    await acceptCookies();
    await waitForSelectorLoad();
  } else if (id) {
    const url = `https://www.${domain}/GBUK/product-{id}-pdt.html`.replace('{id}', encodeURIComponent(id));
    await context.goto(url, { timeout, waitUntil: 'networkidle0' });
    const productPage = await context.evaluate(() => !!document.querySelector('div.product-page'))
    console.log('Checking no results');
    if(!productPage) return 'no result';
    await acceptCookies();
    // await context.waitForSelector('input[name="search-field"]', { timeout });
    // await context.evaluate(async function (inpId) {
    //   const inp = document.querySelector('input[name="search-field"]');
    //   inp.value = inpId;
    // }, id);
    // await context.click('form[action*="search_keywords"] button');
    // await context.waitForNavigation({ timeout, waitUntil: 'load' });
    await waitForSelectorLoad();
  }
};

module.exports = { implementation };
