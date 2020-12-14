
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: "''",
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try{
      await context.evaluate(()=>{
        scroll(0, 1500);
      })
      await context.waitForSelector('video source');
      await context.evaluate(() => {
        let video = '';
        video = document.querySelector('video source').getAttribute('src');
        document.querySelector('body').setAttribute('video',video);
      })
    }catch(err){
      console.log('No video present')
    }
    await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      if (e) {
        e.click();
      }
    }, '//li[contains(text(),"Overview")]');
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      let descriptionBulletCount = document.evaluate(`count(//span[starts-with(.,'Highlights')]//parent::div/ul/li)`,document).numberValue;
      addHiddenDiv('descriptionBulletCount' , descriptionBulletCount);

      if (document.querySelector('div[class="viewFullSpec"] a')) {
        document.querySelector('div[class="viewFullSpec"] a').click();
        await stall(2000);
      }
      let specsText = '';
      const tableData = document.querySelectorAll('div[name="TabArea"]~div table tr td');
      if (tableData !== null) {
        for (let i = 0; i < tableData.length; i++) {
          console.log(tableData[i].innerText);
          specsText += tableData[i].innerText + ' | ';
        }
      }
      addHiddenDiv('specsText', specsText);
    });
    return await context.extract(productDetails, { transform });
  },
};
