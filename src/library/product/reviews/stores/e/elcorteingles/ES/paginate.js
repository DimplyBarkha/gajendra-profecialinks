

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { page } = inputs;
  const { nextLinkSelector } = parameters;

  try {
    await context.waitForSelector(nextLinkSelector, { timeout: 30000 });
  } catch (err) {
    console.log(`Couldn't load selector => ${nextLinkSelector}`);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 1000))
  
  await context.evaluate(function (nextLinkSelector) {
  if (document.querySelector(nextLinkSelector)) {
    document.querySelector(nextLinkSelector).click();
  }});

  return false;
}
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'elcorteingles',
    nextLinkSelector: 'li[class*="item-next"]>a',
    resultsDivSelector: '*[class*="content-list-reviews"]',
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation
};
