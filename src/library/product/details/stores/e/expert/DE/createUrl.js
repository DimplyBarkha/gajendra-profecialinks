
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'expert.de',
    prefix: null,
    country: 'DE',
    store: 'expert',
  },
};

// module.exports = {
//   implements: 'product/details/createUrl',
//   parameterValues: {
//     domain: 'expert.de',
//     // prefix: 'suche?q=',
//     // suffix: '&qpage=1',
//     timeout: 20000,
//     // url: 'https://expert.de/suche?q={id}&qpage=1',
//     country: 'DE',
//     store: 'expert',
//     zipcode: '',
//   },
//   implementation: async ({ id }, parameters, context, dependencies) => {
//     const { timeout = 45000, waitUntil = 'load', checkBlocked = true } = {};
//     const domain = 'expert.de';
//     const searchUrl = `https://www.${domain}/suche?q=${id}&qpage=1[!opt!]{"anti_fingerprint":false, "mode":"no-cors", "setblockads":false}[/!opt!]`;
//     // await gotoUrl({ url: searchUrl }, { domain }, context);
//     // await context.goto(searchUrl, { timeout, waitUntil, checkBlocked });
//     return searchUrl;
//     // await context.setInputValue('input#q', id);

//     /*
//     const path = await context.evaluate(() => {
//       const xpathFirstResult = '//div[@id="product-row-0"]//a[@name="product-title"]/@href';
//       const node = document.evaluate(xpathFirstResult, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//       if (node && node.singleNodeValue) {
//         return node.singleNodeValue.nodeValue;
//       } else {
//         return false;
//       }
//     });
//     if (!path) {
//       throw new Error('404: Item not found');
//       // context.extract('product/details/stores/w/walgreens/us/extract')
//         // .then(() => {
//           // throw new Error('404: Item not found');
//         // });
//     } else {
//       console.log(`https://${domain}${path}`);
//       return `https://${domain}${path}`;
//     }
//     */
//   },

// };
