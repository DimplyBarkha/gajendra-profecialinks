
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'metro',
    domain: 'metro.de',
    loadedSelector: null,
    noResultsXPath: '//h3[contains(@class, "no-bottom-margin")]',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    let { url, id } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      url = await dependencies.createUrl({ id });
    }
    // TODO: Check for not found?
    await dependencies.goto({ url, timeout: 50000 });
    await context.waitForSelector('a.title');
    await new Promise(resolve => setTimeout(resolve, 10000));
    const linkURL = await context.evaluate(function () {
      const element = document.querySelectorAll('a.title');
      if (element[0]) {
        return element[0].href;
      } else {
        return null;
      }
    });
    if (linkURL) {
      await context.goto(linkURL);
    } else {
      await context.goto('https://produkte.metro.de/shop/search?q=noResultFound');
    }
  },
};
