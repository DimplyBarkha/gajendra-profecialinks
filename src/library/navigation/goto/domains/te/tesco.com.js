
module.exports = {
  parameterValues: {
    domain: 'tesco.com',
    country: 'UK',
    timeout: 20000,
    store: 'tesco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"force200": true}[/!opt!]`;
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.goto(url);
  },
};
