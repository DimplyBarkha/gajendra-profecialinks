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
        '//div[@itemprop="description"]/li[preceding-sibling::p[1][strong[contains(text(),"In the Box")]]]',
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
      if(values.length) {
        const text = values.join('|| ');
        document.body.setAttribute('in-the-box-text', text);
      } else {
      // Second case. Ex:https://www.arnotts.ie/on/demandware.store/Sites-arnotts-global-Site/en_IE/Product-Variation?pid=1000124126
        
      const inBox = document.evaluate(
        '//div[@itemprop="description"]/li[contains(text(),"in the box?")]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const text = inBox.snapshotItem(0);
      if(text) {
        const witb = text.textContent.match(/[^\?]+$/)[0].split(',').map(text => text.trim().replace(/\./,'')).join(' || ');
        document.body.setAttribute('in-the-box-text', witb);
      }
      }
    });
    async function addIFrameToMainPage() {
      const iframe = document.querySelector("#eky-dyson-iframe");
      if (iframe) {
        const src = iframe.src;
        if (src) {
          const res = await fetch(src);
          const html = await res.text();
          const parent = iframe.parentElement;
          parent.innerHTML = "";
          parent.innerHTML = html;
        }
      }
    }
  await context.evaluate(addIFrameToMainPage);
    return await context.extract(productDetails, { transform });
  },
};
