
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'currys.co.uk',
    timeout: 30000,
    country: 'UK',
    store: 'currys',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"force200": true}[/!opt!]`;
    await context.goto(url);
  },
};
