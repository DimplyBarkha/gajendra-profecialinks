
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'metro_DE',
    domain: 'metro.de',
    loadedSelector: null,
    noResultsXPath: `//span[contains(text(),'Leider haben wir')]`,
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
    //redirecting to product page
    await new Promise(resolve => setTimeout(resolve, 10000));
    const linkURL = await context.evaluate(function () {
      const element = document.querySelectorAll('a.title');
      if (element[0]) {
        return element[0].href;
      } else {
        return null;
      }
    });
    if (linkURL != null) {
      await context.goto(linkURL);
    }
    else {
      await context.goto('https://produkte.metro.de/shop/search?q=noResultFound');
    }
  },
};
