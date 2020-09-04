
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ocado.com',
    timeout: 50000,
    country: 'UK',
    store: 'ocado',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }

    const currentSelector = '.bc-desktopBreadcrumbs__breadcrumbs';
    const result = await context.evaluate((currentSelector) => {
      return Boolean(document.querySelector(currentSelector));
    },currentSelector);
    if(result){
    url = await context.evaluate(async (url)=>{
      let productName = url.split('=');
      let jsonurl = 'https://www.ocado.com/webshop/api/v1/search?searchTerm='+productName[1];
      let res = await fetch(jsonurl);
      let data = await res.json();
      let skus=data.mainFopCollection.sections.map(elm=>elm.fops.map(elm=>elm.sku))
      let sk = skus.flat();
      sk = sk.splice(0,152);
      sk.join(',');
      let url1 = 'https://www.ocado.com/webshop/api/v1/products?skus='+sk+'#[!opt!]{"type":"json"}[/!opt!]';
      return url1;
    },url)
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
  }
},
};
