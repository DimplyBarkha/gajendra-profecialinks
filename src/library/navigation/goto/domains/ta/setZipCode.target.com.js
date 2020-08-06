
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode, storeId } = inputs;

  const splitUrl = inputs.url.split('=');
  const id = splitUrl[1];

  // const { country, domain, store } = parameters;

  /*const currentUrl = await context.evaluate(function() {
    return window.location.href;
  });

  const productId = await context.evaluate(function() {
    return window.location.href.split('=')[1];
  });

  await context.goto('https://scontent.webcollage.net?productId=' + productId + '#[!opt!]{"type":"js","init_js":""}[/!opt!]');

  const enhancedHTML = await context.evaluate(async function() {
    const splitUrl = window.location.href.split('=')[1];
    const productId = splitUrl.split('#')[0];
    return await fetch('https://scontent.webcollage.net/target/power-page?ird=true&channel-product-id=' + productId)
    .then(data => data.text())
    .then(res => {
      const regex = /html: "(.+)"\n\s\s\}\n\}\;/s
      const match = res.match(regex);
      if(match && match.length > 1) {
        return res.match(regex)[1];
      }
      return '';
    });
  });

  await context.goto(currentUrl);*/

  await context.evaluate(async function (zipcode, storeId, productId) {

      function addHiddenDiv(text, id) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('id', id);
        newDiv.textContent = text;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      addHiddenDiv(zipcode, 'zipCode');
      addHiddenDiv(storeId, 'storeId');
      addHiddenDiv(productId, 'productId');


  }, zipcode, storeId, id);

  /*await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
  const productUrl = await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(100);
    const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
    if (link !== null) {
      const href = link.getAttribute('href');
      if (href.indexOf('preselect=') > -1) {
        let productId = href.split('preselect=')[1];
        productId = productId.split('#')[0];
        const splitUrl = href.split('-');
        splitUrl[splitUrl.length - 1] = productId;
        return splitUrl.join('-');
      }
      return href;
    }
  });

  await context.goto('https://www.target.com' + productUrl);*/

  /*await context.evaluate(function(html) {

    const newDiv = document.createElement('div');
    newDiv.id = "enhancedHtml";
    let nodeArrayRegex = />([a-zA-Z 0-9\.\-\&\!\@\#\$\%\^\*\;]{2,})</g
    let text = html.match(nodeArrayRegex)
    if (text) {
      let extractedText = text.join(' ').replace(/>/g,'').replace(/</g,'').replace(/\&amp\;/g, '&').replace(/  /g,' ').trim();
      newDiv.innerHTML = extractedText;
      document.body.appendChild(newDiv);
    }


    const newDiv2 = document.createElement('div');
    newDiv2.id = "mediaHtml";
    newDiv2.innerHTML = unescape(html.replace(/\\\\\\/g, '').replace(/\\/g,'')).replace(/\"/g,'').replace(/"""/g, '');
    document.body.appendChild(newDiv2);


  }, enhancedHTML);*/

}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'target.com',
    store: 'target',
  },
  implementation,
};
