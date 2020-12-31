
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    await dependencies.goto({ url });
    return await context.evaluate(async function () {
      if (document.querySelector('div[id="category-grid"] div:first-child a')) {
        return document.querySelector('div[id="category-grid"] div:first-child a').href;
      }
    });
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  dependencies: {
    goto: 'action:navigation/goto',
  },
  parameterValues: {
    domain: 'joycemayne.com.au',
    prefix: null,
    url: 'https://www.joycemayne.com.au/catalogsearch/result/?q={id}',
    country: 'AU',
    store: 'joycemayne',
    zipcode: '',
  },
  implementation,
};
