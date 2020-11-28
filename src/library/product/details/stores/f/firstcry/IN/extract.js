async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (document.querySelectorAll("div[id*='div_prod_desc'] div[class*='R14_61 p-prod-desc'] ul:nth-child(3) li")) {
      const descriptionBullets = document.querySelectorAll("div[id*='div_prod_desc'] div[class*='R14_61 p-prod-desc'] ul:nth-child(3) li").length;
      if (descriptionBullets > 0) addHiddenDiv('ii_descriptionBullets', descriptionBullets);
      const descriptionBullet = document.querySelectorAll("div[id*='div_prod_desc'] div[class*='R14_61 p-prod-desc'] ul li").length;
      console.log('bullets' + descriptionBullet);
      if (descriptionBullet > 0) addHiddenDiv('ii_descriptionBullets', descriptionBullet);
    }
    if (document.querySelectorAll('#slide-wrap > div.swiper-slide.swiper-slide > img')) {
      const totalImgCount = document.querySelectorAll('#slide-wrap > div.swiper-slide.swiper-slide > img').length;
      if (totalImgCount > 0) addHiddenDiv('imgCount', totalImgCount);
    }
    // @ts-ignore
    const color = document.querySelector('#big-img').alt;
    var variant = '';
    if (color) {
      variant = color.split('-')[1];
    }
    addHiddenDiv('variant', variant);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'firstcry',
    transform: null,
    domain: 'firstcry.com',
    zipcode: "''",
  },
  implementation,
};
