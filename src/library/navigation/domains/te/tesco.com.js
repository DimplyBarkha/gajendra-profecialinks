module.exports = {
  parameterValues: {
    domain: 'tesco.com',
    country: 'UK',
    store: 'tesco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(`${url}#[!opt!]{"force200":true, "first_request_timeout": 50000}[/!opt!]`, { timeout: 100000, waitUntil: 'load' });
  },
};
