async function implementation(inputs, parameters, context, dependencies) {
  // NOTE: Ugly hack to avoid nightmare timeout error in case of more reviews, limiting pages to 35

  const { loadedSelector, nextLinkSelector } = parameters;
  if (nextLinkSelector) {
    try {
      console.log("Clicking", nextLinkSelector);
      await context.click(nextLinkSelector, {}, { timeout: 20000 });
      if (loadedSelector) {
        await context.waitForSelector(loadedSelector, { timeout: 20000 });
      }
      return true;
    } catch (error) {
      console.log("The selector didn't appear.");
    }
  }
  return false;
}

module.exports = {
  parameterValues: {
    country: "BR",
    store: "drogaraia",
    nextLinkXpath: '//div[contains(@class,"ts-button--more")]/span',
    nextLinkSelector: "div.ts-button--more > span",
    loadedSelector: "ul.ts-reviews-list > li",
    noResultsXPath: null,
    domain: "drogaraia.com.br",
    zipcode: "",
  },
  implementation,
};
