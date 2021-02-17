async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    const reviewcount = document.querySelector('div#h1link h1').innerHTML.match(/(\d+)件/g)[0].match(/\d+/g);
    if (reviewcount && parseInt(reviewcount[0]) > 30) {
      let top = document.querySelector('.Column__center').scrollHeight;
      while (true) {
        top = top + 1000;
        const count = document.querySelectorAll('li.LoopList__item').length;
        document.querySelector('.Column__center').scrollTo(0, top);
        await new Promise(resolve => setTimeout(resolve, 100));
        if (parseInt(reviewcount[0]) === count) {
          break;
        }
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'JP',
    store: 'yahoo',
    transform: null,
    domain: 'yahoo.co.jp',
    zipcode: '',
  },
  // implementation,
};
