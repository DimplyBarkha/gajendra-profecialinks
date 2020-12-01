
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'clubeextra.com.br',
    timeout: 60000,
    country: 'BR',
    store: 'deliveryExtra',
    zipcode: '',
  },
  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
  //   // const timeout = parameters.timeout ? parameters.timeout : 10000;
  //   // context.deleteCookies();
  //   // await context.evaluate(async () => {
  //   //   async function deleteAllCookies () {
  //   //     // var cookies = document.cookie.split(';');
  //   //     // for (var i = 0; i < cookies.length; i++) {
  //   //     //   var cookie = cookies[i];
  //   //     //   var eqPos = cookie.indexOf('=');
  //   //     //   var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //   //     //   document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  //   //     // }
  //   //     localStorage.clear();
  //   //   }
  //   //   await deleteAllCookies();
  //   // });
  //   url = `${url}#[!opt!]{"cookies":[]}[/!opt!]`;
  //   // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  //   let count = 0;
  //   while (true && count < 3) {
  //     await context.goto(url);
  //     const proceed = await context.evaluate((reqUrl) => {
  //       const url = window.location.href;
  //       const searchTerm = url.replace(/.*w=(.*)&qt=.*/, '$1').replace(/%20/gm, ' ');
  //       const reqSearchTerm = reqUrl.replace(/.*w=(.*)&qt=.*/, '$1').replace(/%20/gm, ' ');
  //       return searchTerm == reqSearchTerm;
  //     }, url);
  //     if (proceed) {
  //       break;
  //     };
  //     count++;
  //   }
  //   console.log(zipcode);
  //   if (zipcode) {
  //     await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
  //   }
  // },
};
