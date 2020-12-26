
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;
  const { goto } = dependencies;
  let url;
  if (parameters.url) {
    url = parameters.url.replace('{id}', encodeURIComponent(id));
    await goto({ url });
  }
  const noResults = await context.evaluate(() => {
  if(document.querySelector('[data-test="heading-num-results"]')) {
    if(document.querySelector('[data-test="heading-num-results"]').innerText.match(/\d+/)[0] == '0') {
    return true;
   } else {
     return false;
   }
  }})
  if(noResults) return url;
  const prodUrl = await context.evaluate(() => {
    return document.querySelector('a[class^="product-card"]') ? document.querySelector('a[class^="product-card"]').href : false;
  })
  if(prodUrl) {
  await goto({url: prodUrl});
  } else {
    return url;
  }
  async function getUrlFromCode(code) {
    function getVariantUrls() {
      let variants = [];
      const nodes = Array.from(document.querySelectorAll('ul.size-list li.size-small-item > a, ul.swatch-list li.swatch-list-item > a'));
      if (nodes.length) {
        variants = nodes.map(elm => elm.href);
      } else {
        variants.push[window.location.href];
      }
      return variants;
    }
    async function findProductById(pid, code) {
      if (window.__NEXT_DATA__) {
        const skus = __NEXT_DATA__.props.pageProps.skus;
        if (skus.length > 1) {
          const requiredSku = __NEXT_DATA__.props.pageProps.skus.find(elm => elm.code.toString() === code.toString());
          const sku = requiredSku.id;
          return await getUrl(pid, sku);
        } else {
          return window.location.href
        }
      } else {
        const urls = getVariantUrls();
        for (url of urls) {
          const productCode = await getProductCodeFromUrl(url);
          if (productCode == code) {
            return url;
          }
        }
      }
    }
    async function getUrl(productId, skuId) {
      const API = `https://www.johnlewis.com/recently-viewed-information/json?productId=${productId}&skuId=${skuId}&romanBlind=false`;
      const response = await fetch(API);
      const data = await response.json();
      return `https://www.johnlewis.com${data.url}`;
    }
  
    async function getProductCodeFromUrl(url) {
      const response = await fetch(url);
      const html = await response.text();
      const code = html.match(/data-product-code="([^"]+)/)[1];
      return code;
    }
    const productId = window.location.pathname.match(/[^\/]+$/)[0].split(/^p/)[1];
    return await findProductById(productId, code)
  }
  return (await context.evaluate(getUrlFromCode, id)) || url;
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'johnlewis.com',
    prefix: null,
    url: 'https://www.johnlewis.com/search?search-term={id}',
    country: 'UK',
    store: 'johnlewis',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
