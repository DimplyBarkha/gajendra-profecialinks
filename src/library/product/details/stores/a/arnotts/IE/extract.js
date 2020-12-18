const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // if (document.querySelector('div#flix-inpage-wrapper')) {
      //   const manuDesc = document.querySelector('div#flix-inpage').innerText;
      //   addHiddenDiv('manuDesc', manuDesc);
      // }
      if (document.querySelector('li#pdp-carousel-video img.productthumbnail')) {
        const videoData = JSON.parse(document.querySelector('li#pdp-carousel-video img.productthumbnail').getAttribute('data-lgimg'));
        if (videoData) {
          let videoUrl = videoData.videoData;
          videoUrl = videoUrl.replace('.json', '/mp4_720p');
          addHiddenDiv('videoUrl', videoUrl);
        }
      }
      if (document.querySelector('div.tab-content')) {
        if (document.querySelector('div.tab-content').getAttribute('itemprop') == 'description') {
          let desc = document.querySelector('div.tab-content').innerHTML;
          desc = desc.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
          addHiddenDiv('desc', desc);
        }
      }
    });

    // For inTheBoxText
    await context.evaluate(() => {
      const inBox = document.evaluate(
        '//p[contains(.,"tools included")]/following-sibling::*',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const values = [];
      for (let i = 0; i < inBox.snapshotLength; i++) {
        const item = inBox.snapshotItem(i);
        // @ts-ignore
        const strong = item.querySelector('strong');
        if (strong) {
          break;
        } else {
        // @ts-ignore
          const t = item.textContent;
          values.push(t);
        }
      }
      const text = values.join('|| ');
      document.body.setAttribute('in-the-box-text', text);
    });
    return await context.extract(productDetails, { transform });
  },
};
