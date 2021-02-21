const implementation = async (
  { id, url },
  { domain, loadedSelector, noResultsXPath },
  context,
  dependencies,
) => {
  const timeout = 120000;
  // const timeout = parameters.timeout ? parameters.timeout : 60000;
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setFirstRequestTimeout(100000);
  await context.setUseRelayProxy(false);
  await context.setJavaScriptEnabled(true);
  await context.setBypassCSP(true);
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
    await context.setBypassCSP(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0' });
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@GOTO@@@@@@@@@@@@@@@@@@@@@@@@@@');
    await acceptCookies();
    await waitForSelectorLoad();
  } else if (id) {
    await context.setBypassCSP(true);
    await context.goto(`https://www.currys.co.uk/gbuk/search-keywords/xx_xx_xx_xx_xx/${id}/xx-criteria.html`, { timeout: timeout, waitUntil: 'networkidle0' });
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$ID$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    await acceptCookies();
    // await context.waitForSelector('input[name="search-field"]', { timeout });
    // await context.evaluate(async function (inpId) {
    //   const inp = document.querySelector('input[name="search-field"]');
    //   inp.value = inpId;
    // }, id);
    // await context.click('form[action*="search_keywords"] button');
    await context.waitForNavigation({ timeout, waitUntil: 'load' });
    await waitForSelectorLoad();
  }
  const noResults = await context.evaluate((xpath) => document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  console.log('Checking no results');
  if (noResults) return false;
  await acceptCookies();
  await waitForSelectorLoad();
  return true;
};

module.exports = { implementation };
