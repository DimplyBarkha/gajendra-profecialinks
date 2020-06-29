module.exports = {
  parameterValues: {
    domain: 'tesco.com',
    country: 'UK',
    store: 'tesco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    //fix for getting first request timeout and blocked status when no results in search
    await context.goto(`${url}#[!opt!]{"force200":true, "first_request_timeout": 50000}[/!opt!]`, { timeout: 100000, waitUntil: 'load' });
  },
};