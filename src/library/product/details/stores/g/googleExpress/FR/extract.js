const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variantLength = await context.evaluate(async () => {
    console.log('Variants:::: ', document.querySelector("[class*='sh-dvc__color'] a[class*='sh-dvc__item']"));
    return document.querySelectorAll("[class*='sh-dvc__color'] a[class*='sh-dvc__item']") ? document.querySelectorAll("[class*='sh-dvc__color'] a[class*='sh-dvc__item']").length : 0;
  });
  async function preparepage (variantLength) {
    await context.evaluate(async (variantLength) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // @ts-ignore
      const brand = document.evaluate("//section[contains(@id,'specs')]//td[contains(.,'Marque')]//following-sibling::td | //section[contains(@id,'specs')]//td[contains(.,'Brand')]//following-sibling::td", document).iterateNext() ? document.evaluate("//section[contains(@id,'specs')]//td[contains(.,'Marque')]//following-sibling::td | //section[contains(@id,'specs')]//td[contains(.,'Brand')]//following-sibling::td", document).iterateNext().textContent.trim() : '';
      // @ts-ignore
      const title = document.querySelector("span[class*='title-pdp']") ? document.querySelector("span[class*='title-pdp']").innerText.trim() : '';
      let nameExtended = '';
      if (brand && title && title.indexOf(brand) !== 0) {
        nameExtended = brand + ' - ' + title;
      } else {
        nameExtended = title;
      }
      addHiddenDiv('ii_name', title);
      addHiddenDiv('ii_nameExtended', nameExtended);
      if (!brand) {
        addHiddenDiv('ii_brand', title.split(' ')[0]);
      } else {
        addHiddenDiv('ii_brand', brand);
      }
      const descUpperNode = document.querySelectorAll("ul[class*='xpDPYb']") ? document.querySelectorAll("ul[class*='xpDPYb']") : null;
      let descContent = '';
      for (let i = 0; i < descUpperNode.length; i++) {
        descContent += ' ' + descUpperNode[i].innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/·/gm, ' ||').replace(/\s{2,}/gm, ' ').trim();
      }
      // @ts-ignore
      // const desclower = document.querySelector("div[class*='BfIk5d']") ? document.querySelector("div[class*='BfIk5d']").innerText.replace(/·/gm, ' ||').replace(/\s{2,}/gm, ' ').trim() : '';
      const desclower = document.querySelector("span[class*='sh-ds__full-txt']") ? document.querySelector("span[class*='sh-ds__full-txt']").innerText.replace(/·/gm, ' ||').replace(/\s{2,}/gm, ' ').trim() : '';
      if (descContent && desclower) {
        addHiddenDiv('ii_desc', descContent + ' | ' + desclower);
      } else if (descContent) {
        addHiddenDiv('ii_desc', descContent);
      } else if (desclower) {
        addHiddenDiv('ii_desc', desclower);
      }
      if (variantLength > 0) {
        const variantInformation = document.evaluate("//div[contains(@class,'sh-dvp__variant-picker')]//div[contains(@class,'eyAVeb') and contains(.,'Colour')]//span | //div[contains(@class,'sh-dvp__variant-picker')]//div[contains(@class,'eyAVeb') and contains(.,'Couleur')]//span", document).iterateNext() ? document.evaluate("//div[contains(@class,'sh-dvp__variant-picker')]//div[contains(@class,'eyAVeb') and contains(.,'Colour')]//span | //div[contains(@class,'sh-dvp__variant-picker')]//div[contains(@class,'eyAVeb') and contains(.,'Couleur')]//span", document).iterateNext().textContent.trim() : '';
        addHiddenDiv('ii_variantInfomation', variantInformation);
        const firstVariant = document.evaluate("//div[contains(@class,'sg-product')]/@data-gpcid", document).iterateNext() ? document.evaluate("//div[contains(@class,'sg-product')]/@data-gpcid", document).iterateNext().textContent.trim() : '';
        addHiddenDiv('ii_firstVariant', firstVariant);
        addHiddenDiv('ii_variantCount', variantLength + 1);
      }
    }, variantLength);
  }
  for (let index = 0; index < variantLength; index++) {
    await preparepage(variantLength);
    await context.extract(productDetails, { transform }, { type: 'APPEND' });
    await context.clickAndWaitForNavigation(`[class*='sh-dvc__color'] a[class*='sh-dvc__item']:nth-child(${index + 1})`);
    await context.waitForSelector("div[class*='sh-div__link-to-overlay'] div[class*='div__viewport'] div[class*='main-image'] img", { timeout: 20000 });
    // await context.evaluate(async (index) => {
    //   const variant = document.querySelectorAll("[class*='sh-dvc__color'] a[class*='sh-dvc__item']") ? document.querySelectorAll("[class*='sh-dvc__color'] a[class*='sh-dvc__item']") : null;
    //   variant[index] && await variant[index].click();
    // }, index);
    // await new Promise((resolve) => { setTimeout(resolve, 10000); });
  }
  await preparepage(variantLength);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'googleExpress',
    transform,
    zipcode: '',
    domain: 'google.com',
  },
  implementation,
};
