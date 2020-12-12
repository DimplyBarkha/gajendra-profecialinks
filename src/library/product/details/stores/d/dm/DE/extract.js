const { transform } = require('../format.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // to close random popups
  const closeRandomPopups = await context.evaluate(function () {
    return !!document.evaluate('//button[@data-dmid="layer-header-close-button"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (closeRandomPopups) {
    await context.click('button[data-dmid="layer-header-close-button"]');
  }

  // to close cookies popup on all products
  const closeCookiesPopup = await context.evaluate(function () {
    return !!document.evaluate('//button[@data-dmid="cookiebar-ok"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (closeCookiesPopup) {
    await context.click('button[data-dmid="cookiebar-ok"]');
  }

  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';

      document.body.appendChild(newDiv);
    }
    if (document.querySelector('div[data-dmid="detail-image-slider-container"] div[data-dmid="thumbnail-container"] button[data-dmid="thumbnail-button"] img[src*="youtube"]')) {
      // while (document.querySelector('div[data-dmid="detail-image-slider-container"] div[data-dmid="thumbnail-container"] button[data-dmid="thumbnail-button"] img[src*="youtube"]')) {
      // div[data-dmid="detail-image-slider-container"] div[data-dmid="thumbnail-container"] button:nth-child(3n)[data-dmid="thumbnail-button"] img[src*="youtube"]
      var videoCount = document.querySelectorAll('div[data-dmid="detail-image-slider-container"] div[data-dmid="thumbnail-container"] button[data-dmid="thumbnail-button"] img[src*="youtube"]').length;
      for (var i = 1; i < videoCount; i++) {
        document.querySelector('div[data-dmid="detail-image-slider-container"] div[data-dmid="thumbnail-container"] button:nth-child(' + i + 'n)[data-dmid="thumbnail-button"] img[src*="youtube"]').click();
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        const videoUrl = document.querySelector('div[data-dmid="layer-container"] iframe[src*="youtube"]').getAttribute('src');
        console.log('videoUrl: ', videoUrl);
        addHiddenDiv('youtubeVideoUrl_' + i, videoUrl);
        document.querySelector('button[data-dmid="layer-header-close-button"]').click();
      }
      document.querySelector('div[data-dmid="detail-image-slider-container"] div[data-dmid="thumbnail-container"] button:last-child[data-dmid="thumbnail-button"] img[src*="youtube"]').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const videoUrl = document.querySelector('div[data-dmid="layer-container"] iframe[src*="youtube"]').getAttribute('src');
      console.log('videoUrl: ', videoUrl);
      addHiddenDiv('youtubeVideoUrl_' + videoCount, videoUrl);
      // }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 6000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
  },
  implementation,
};
