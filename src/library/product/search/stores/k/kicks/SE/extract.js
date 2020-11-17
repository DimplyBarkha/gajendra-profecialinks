const { transform } = require('../../../../shared');
async function implementation (
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
await context.evaluate(async () => {
while(!!document.querySelector('#container > div > div > div.a.h > main > div > div.b7.b8.b9.ba > div > div.i.j.k.a.b > div.i.j.k.ce.fz.cf.g0.cg.g1.ch.g2.ci.g3.cj.g4.a.b.q.g5 > button')){
// @ts-ignore
document.querySelector('#container > div > div > div.a.h > main > div > div.b7.b8.b9.ba > div > div.i.j.k.a.b > div.i.j.k.ce.fz.cf.g0.cg.g1.ch.g2.ci.g3.cj.g4.a.b.q.g5 > button').click()
await new Promise(r => setTimeout(r, 6000));
}
})
return await context.extract(productDetails, { transform });
}
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'SE',
store: 'kicks',
transform: transform,
domain: 'kicks.se',
},
implementation,
};