async function implementation(
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const patternReplace = () => {
    if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
    let tempUrl = reviewUrl;
    if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
    if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
    if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
    return tempUrl;
  };
  const destinationUrl = url || patternReplace();

  await dependencies.goto({ url: destinationUrl, zipcode });

  await context.evaluate(async()=>{
    if (document.querySelector('#onetrust-accept-btn-handler')) {
      document.querySelector('#onetrust-accept-btn-handler').click();
    }
  
    if (document.querySelector('#btn-entry-age-allow')) {
      document.getElementById('age-gate-dob-day').getElementsByTagName('option')[1].selected = 'selected';
      document.getElementById('age-gate-dob-month').getElementsByTagName('option')[1].selected = 'selected';
      document.getElementById('age-gate-dob-year').value = '2000';
      await new Promise((resolve) => setTimeout(resolve, 2000));
      document.querySelector('#btn-entry-age-allow').click();
    }
  })

  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || !document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    return document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
  }, noResultsXPath);
}
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'govype',
    domain: 'govype.com',
    loadedSelector: 'div.page-bottom',
    noResultsXPath: 'boolean(//div[@class="netreviews-stars"])',
    // noResultsXPath: '//div[@id="custom_noReview"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
  implementation,
};
