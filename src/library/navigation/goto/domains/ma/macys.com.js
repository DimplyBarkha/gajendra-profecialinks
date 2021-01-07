
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'macys.com',
    country: 'US',
    store: 'macys',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 500000,
      waitUntil: 'load',
      css_enabled: true,
      discard_CSP_header: true,
      embed_iframes: true,
      force200: true,
      js_enabled: true,
      proxy: {
        use_relay_proxy: false
      },
      anti_fingerprint: false,
      first_request_timeout: 30000,
      goto_timeout: 30000,
      random_move_mouse: false,
    });
  },
};
