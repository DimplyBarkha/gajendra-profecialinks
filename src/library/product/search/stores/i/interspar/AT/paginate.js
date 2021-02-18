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
  implements: 'navigation/paginate',
  parameterValues: {
    country: "AT",
    store: "interspar",
    nextLinkXpath: '//*[@id="productsFood-content"]/div/button[contains(@class,"search-content__more")]',
    nextLinkSelector: "#productsFood-content > div > button",
    loadedSelector: "#productsFood-content > div > div.container.offerbar > div > a",
    noResultsXPath: null,
    domain: "interspar.at",
    zipcode: " ",
  },
  implementation,
};
