const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
  },
  implementation,
};
async function implementation(
  inputs,
  { country, store, transform, domain },
  context,
  { productDetails },
) {
  const isVideoPresent = await context.evaluate(async function () {
    return document.querySelector('li.videoThumbnail');
  });

  if (isVideoPresent) {
    await context.click('li.videoThumbnail');
    await context.waitForSelector('div#main-video-container video');
  }

  const productPrimeCheck = async () => {
    console.log('EXECUTING PRIME RELATED CODE.');
    let primeValue = 'No';
    const merchantAnchors = document.querySelectorAll('#merchant-info a');
    const buyBoxSpans = document.querySelectorAll('#buybox span');
    const metaNames = document.querySelectorAll('meta[name]');

    const findMatchingString = (nodeList) => {
      return new Promise((resolve, reject) => {
        for (const node of nodeList) {
          const text = node.textContent;

          if (text.match(/sold by amazon/ig)) {
            return resolve('Yes - Shipped & Sold');
          } else if (text.match(/fulfilled by amazon/ig)) {
            return resolve('Yes - Fulfilled');
          } else if (text.match(/prime pantry/ig)) {
            return resolve('Prime Pantry');
          }
        }

        return resolve(undefined);
      });
    };

    if (document.querySelector('i#burjActionPanelAddOnBadge.a-icon.a-icon-addon')) {
      primeValue = 'Add-On';
    }

    if (document.querySelector('body').innerHTML.match(/Exclusively for Prime Members/ig)) {
      return 'Prime Exclusive';
    }

    if (merchantAnchors && merchantAnchors.length) {
      const res = await findMatchingString(merchantAnchors);

      if (res) {
        primeValue = res;
      }
    }

    if (buyBoxSpans && buyBoxSpans.length) {
      const res = await findMatchingString(buyBoxSpans);

      if (res) {
        primeValue = res;
      }
    }

    if (metaNames && metaNames.length) {
      const res = await findMatchingString(metaNames);

      if (res) {
        primeValue = res;
      }
    }

    document.querySelector('body').setAttribute('primeValue', primeValue);
  };

  await context.evaluate(productPrimeCheck);

  return await context.extract(productDetails, { transform });
}
