module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'saturn.de',
    timeout: null,
    country: 'DE',
    store: 'saturn',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    async function getHtml (url) {
      const response = await fetch(url);
      return await response.text();
    }
    async function addHtml (html) {
      const div = document.createElement('div');
      div.setAttribute('id', 'enhanced-content');
      div.innerHTML = html;
      const scripts = div.getElementsByTagName('script');
      let i = scripts.length;
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
      }
      document.body.append(div);
    }

    async function getEnhancedContentLink () {
      const pageType = document.querySelector('meta[property="og:type"]').getAttribute('content');
      if (pageType !== 'og:product') return false;
      try {
        const jsonData = JSON.parse(Array.from(document.querySelectorAll('script')).find(elm => elm.innerText.includes('gtin13')).textContent);
        const gtin = jsonData.gtin13;
        return `https://loadbee.com/ean/${gtin}/de_DE`;
      } catch (err) {
        console.log('failed to get gtin', err);
        return false;
      }
    }

    async function addEnhancedContent () {
      const enhancedContentLink = await context.evaluate(getEnhancedContentLink);
      if (enhancedContentLink) {
        await context.goto(enhancedContentLink);
        const html = await context.evaluate(getHtml, enhancedContentLink);
        await context.goto(url);
        await context.evaluate(addHtml, html);
      }
    }

    await context.goto(url);
    await addEnhancedContent();
  },
};
