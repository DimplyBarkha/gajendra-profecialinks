module.exports = {
  parameters: [],
  inputs: [],
  dependencies: {
  },
  implementation: async ({ nextLinkSelector }, parameters, context, dependencies) => {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
    await Promise.all([
      context.waitForNavigation({ timeout: 10000, waitUntil: 'load' }),
      context.click(nextLinkSelector)
    ]);
    return true;
  }
};
