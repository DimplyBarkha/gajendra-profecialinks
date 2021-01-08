const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.com.au',
    zipcode: '',
  },
implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
await new Promise((resolve, reject) => setTimeout(resolve, 9000));
const applyScroll = async function (context) {
await context.evaluate(async function () {
let scrollTop = 0;
while (scrollTop !== 5000) {
await stall(1000);
scrollTop += 1000;
window.scroll(0, scrollTop);
if (scrollTop === 5000) {
await stall(1000);
break;
}
}
function stall (ms) {
return new Promise((resolve, reject) => {
setTimeout(() => {
resolve();
}, ms);
});
}
});
};
await applyScroll(context);
return await context.extract(productDetails, { transform });
},
};

