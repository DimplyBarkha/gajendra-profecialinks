async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('iframe#desc_ifr');
  } catch (err) {
    console.log('manufacturer contents not loaded or unavailable');
  }
  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('iframe#desc_ifr');
    // @ts-ignore
    const src = iframe ? iframe.src : '';
    return src;
  });

  async function scrollToRec(node) {
    await context.evaluate(async (node) => {
      var element = document.querySelector(node);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  await scrollToRec('#rpdCntId, .prodDetailDesc');
  try {
    await context.waitForSelector('#glbfooter');
  } catch (error) {
    console.log('No glbfooter');
  }
  await scrollToRec('#glbfooter, footer');
  try {
    await context.waitForSelector('#FootPanel');
  } catch (error) {
    console.log('No glbfooter');
  }

  async function checkUPDP() {
    await context.evaluate(async () => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        var updp = document.querySelectorAll('div.mfe-recos-container div.mfe-title.container-truncate span');
        if (updp) {
          updp.forEach(item => {
            addElementToDocument('updp_item', item.innerText);
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      } catch (e) {
        console.log('unInterruptedPDP not found');
      }
    });
  }
  await checkUPDP();

  await context.extract(productDetails, { transform });
  if (src) {
    try {
      await context.setBypassCSP(true);
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('div#ds_div');
      try {
        await context.waitForSelector('div#inthebox');
      } catch (error) {
        console.log('No inthebox');
      }
      await scrollToRec('div#inthebox');
      await scrollToRec('div.inthebox');
      await scrollToRec('div#footer-wrapper');
      return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    } catch (error) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (error) {
        console.log('could not load page', error);
      }
    }
  }
}

module.exports = { implementation };
