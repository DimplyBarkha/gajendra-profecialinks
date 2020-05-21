module.exports = {
  parameters: [],
  inputs: [],
  dependencies: {
  },
  implementation: async ({ nextLinkSelector, mutationSelector, loadedSelector, spinnerSelector }, parameters, context, dependencies) => {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }

    if (spinnerSelector) {
      // this may replace the section with a loader
      await context.click(nextLinkSelector);
      await context.waitForFunction(function (selector) { return !document.querySelector(selector); }, spinnerSelector);
    } else if (mutationSelector) {
      // this may replace the section with a loader
      await Promise.all([
        context.click(nextLinkSelector),
        // possible race condition if the data returned too fast, but unlikely
        context.waitForMutuation(mutationSelector, { timeout: 10000 }),
      ]);
    } else {
      await Promise.all([
        context.waitForNavigation({ timeout: 10000, waitUntil: 'load' }),
        context.click(nextLinkSelector),
      ]);
      if (loadedSelector) {
        await context.waitForSelector(loadedSelector, { timeout: 10000 });
      }
    }
    return true;
  },
};
