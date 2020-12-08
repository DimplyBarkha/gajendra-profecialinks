async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(() => {
    function monthDiff(d1, d2) {
      let months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months <= 0 ? 0 : months;
    }
    const firstDate = new Date(document.body.getAttribute('firstDate'));
    const divs = document.querySelectorAll('li meta[itemprop="datePublished"]');
    divs.forEach((meta) => {
      const date = new Date(meta.getAttribute('content'));
      if (monthDiff(date, firstDate) !== 0) {
        if (document.querySelector('li[class*="item-next"]>a')) {
          document.querySelector('li[class*="item-next"]>a').remove();
        }
      }
    });
  });
  return await context.extract(productReviews, { transform });
}
const { transform } = require('./shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.es',
    zipcode: "",
  },
  implementation,
};
