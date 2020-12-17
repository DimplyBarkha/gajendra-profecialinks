const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  await context.evaluate(function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('a#cookies-agree-all');
    const acceptCookies = document.querySelector('a#cookies-agree-all');
    if (acceptCookies) {
      acceptCookies.click();
      optionalWait('meta[itemprop="datePublished"]');
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await context.evaluate(function () {
    const div = document.createElement('div');
    div.setAttribute('class', 'first-review');
    div.textContent = document.querySelector('meta[itemprop="datePublished"]')
      ? document.querySelector('meta[itemprop="datePublished"]').getAttribute('content')
      : null;
    document.body.appendChild(div);
  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation,
};
