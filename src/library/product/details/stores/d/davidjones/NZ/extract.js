const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.evaluate(() => {
        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        if (document.querySelector('div[class*="long-description"]')) {
          let desc = document.querySelector('div[class*="long-description"]').innerHTML;
          desc = desc.replace(/>- /g, '>|| ').replace(/<li.*?>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
          addHiddenDiv('customDescription', desc);
          const bulletExceptLast = desc.replace(/.*?(\|\|.*\|\|).*/g, '$1')
          let bulletLast = ''
          const lengthL = bulletExceptLast.match(/\|\|$/) ? bulletExceptLast.match(/\|\|$/).length : 0
          if (lengthL) {
            const remainingPart = desc.replace(/.*?(\|\|.*\|\|)(.*)/g, '$2').split('.') || []
            bulletLast = remainingPart && remainingPart.length ? remainingPart[0] : ''
          }
          const descriptionBullet = bulletExceptLast + bulletLast
          const descriptionBulletCount = descriptionBullet.match(/\|\|/g) ? descriptionBullet.match(/\|\|/g).length : 0
          if (descriptionBulletCount) {
            addHiddenDiv('bulletsFromDescription', descriptionBullet)
            addHiddenDiv('bulletsFromDescriptionCount', descriptionBulletCount)
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
