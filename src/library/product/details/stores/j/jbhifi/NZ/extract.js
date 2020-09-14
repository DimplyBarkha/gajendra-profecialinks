const { transform } = require('./../shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
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

    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }

    await infiniteScroll();

    let descContent = document.querySelector('div.cms-content').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim();
    descContent = descContent.substring(descContent.indexOf('||')).trim();

    let description = document.evaluate("//div[@id='tab1']//ul", document, null, XPathResult.ANY_TYPE, null);
    description = description.iterateNext().innerText;
    addHiddenDiv('desc', descContent + '|' + description);

    const iframe = document.querySelector('iframe[id*="flixDescription"]').contentDocument.documentElement.innerHTML;
    const domparser = new DOMParser();
    const iframeDom = domparser.parseFromString(iframe, 'text/html');
    if (iframeDom.querySelectorAll('img') !== null) {
      iframeDom.querySelectorAll('img').forEach(element => {
        addHiddenDiv('primary_image', element.src);
      });
      let a = iframeDom.querySelectorAll('div');
      a.forEach(element => {
        if (element.className === 'flix-content') {
          if (element.innerText.search('This content uses cookies to improve your experience.') === -1) {
            addHiddenDiv('abc', element.innerText);
          } else {
            addHiddenDiv('abc', element.innerText.split('This content uses cookies to improve your experience.')[0]);
          }
        }
      });
    }

    const video = document.querySelector('div[class="fluid-width-video-wrapper"]');
    if (video !== null) {
      video.querySelectorAll('iframe').forEach(element => {
        addHiddenDiv('video', element.src);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.co.nz',
    zipcode: '',
  },
  implementation,
};
