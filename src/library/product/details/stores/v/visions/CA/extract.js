const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // await new Promise((resolve) => setTimeout(resolve, 20000));
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let descContent;
    if (document.querySelector("script[type*='application/ld+json']")) {
      // @ts-ignore
      const desc = (document.querySelector("script[type*='application/ld+json']")) ? document.querySelector("script[type*='application/ld+json']").innerText : '';
      const descJSON = (JSON.parse(desc)) ? JSON.parse(desc) : [];
      descContent = (descJSON && descJSON.description) ? descJSON.description.replace(/<.*?>|\\r|\\n|\t/gm, '').replace(/&amp; /gm, '') : '';
    }
    // @ts-ignore
    const enhancedContent = (document.querySelector('div#productdetail-tabs-overview')) ? document.querySelector('div#productdetail-tabs-overview').innerHTML.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    if (document.querySelector('div#productdetail-tabs-overview img') || document.querySelector("div[id='productdetail-tabs-overview'] center iframe")) {
      addHiddenDiv('ii_enhancedContent', enhancedContent);
    } else if (enhancedContent) {
      descContent = descContent.trim() + ' | ' + enhancedContent;
    }
    addHiddenDiv('ii_description', descContent);

    let additionalBullet = ((document.querySelector('div#productdetail-tabs-overview')).innerHTML.match(/•(.*)<br>/gm)) ? (document.querySelector('div#productdetail-tabs-overview')).innerHTML.match(/•(.*)<br>/gm) : [];
    // @ts-ignore
    additionalBullet = additionalBullet.map((item) => {
      return item.replace(/• /gm, '').replace(/<.*?>/gm, '');
    });
    const additionalBullet2 = (document.querySelectorAll('div#productdetail-tabs-overview li')) ? document.querySelectorAll('div#productdetail-tabs-overview li') : [];
    const additionalBullet2Text = [];
    additionalBullet2.forEach((item) => {
      additionalBullet2Text.push(item.innerText);
    });
    const additionalBulletCount = additionalBullet.length + additionalBullet2.length;
    addHiddenDiv('ii_additionalBulletCount', additionalBulletCount);
    if (additionalBullet2Text.length > 0) {
      addHiddenDiv('ii_additionalBullet', additionalBullet.join(' | ') + ' | ' + additionalBullet2Text.join(' | '));
    } else {
      addHiddenDiv('ii_additionalBullet', additionalBullet.join(' | '));
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    transform,
    domain: 'visions.ca',
    zipcode: '',
  },
  implementation,
};
