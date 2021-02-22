module.exports = {
  implements: "product/details/createUrl",
  parameterValues: {
    domain: "meijer.com",
    prefix: null,
    url: 'https://www.meijer.com/shop/en/search/?text={id}',
    country: "US",
    store: "meijer",
    zipcode: "",
  },
  // implementation,
};
 async function implementation (
  inputs,
  parameters,
  context,
  dependencies) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;
  if (parameters.url) {
    const url = parameters.url.replace("{id}", encodeURIComponent(id));
    // return url;
    // console.log(url);
    // await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.goto(url, {
      timeout: 50000,
      waitUntil: "load",
      checkBlocked: true,
    });
    const finalURL = await context.evaluate(async function () {
      let searchURL = document
        .querySelector('div[class="tile-column details"] a')
        .getAttribute("href");
      return "https://www.meijer.com" + searchURL;
    });
    return finalURL;
  }
  let gotoUrl = `https://${domain}`;
  if (prefix) {
    gotoUrl += `/${prefix}`;
  }
  gotoUrl += `/${id}`;
  if (suffix) {
    gotoUrl += `/${suffix}`;
  }
  return gotoUrl;
}