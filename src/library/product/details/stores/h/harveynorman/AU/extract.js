const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function addEnhancedContent () {
    const jsApi = document.querySelector('[src*="ws.cnetcontent.com"]') && document.querySelector('[src*="ws.cnetcontent.com"]').src;
    let jsApi2 = document.querySelector('#flix-minisite no-script, #flix-inpage > script') && document.querySelector('#flix-minisite no-script, #flix-inpage > script').getAttribute('src');
    if (jsApi) {
      const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
      const response = await fetch(jsApi);
      const text = await response.text();
      const text2 = clean(text);
      const array = text2.match(/"htmlBlocks"\s*:\s*(\[.+])\s*,\s*"sites"/)[1];
      const html = unescape(array.match(/ccs-inline-content","html":"(.+)"/)[1].replace(/\\n/g, '')).replace(/\\"/g, '"').replace(/\\'/g, "'");
      const div = document.createElement('div');
      div.id = 'enhanced-content';
      div.innerHTML = html;
      document.body.append(div);
    } else {
      const [sku, ean] = Array.from(document.querySelectorAll('h1.name~small')).map(elm => elm.innerText.trim());
      jsApi2 = `https://media.flixcar.com/delivery/js/inpage/3986/au/mpn/${sku}/ean/${ean}`;
      let response = await fetch('https://cors-anywhere.herokuapp.com/'+jsApi2);
      const js = await response.text();
      const id = js.match(/flixJsCallbacks.pid\s*='([^']+)/)[1];
      response = await fetch(`https://cors-anywhere.herokuapp.com/https://media.flixcar.com/delivery/inpage/show/3986/au/${id}/json`);
      const html = JSON.parse((await response.text()).match(/^\((.+)\)$/)[1]).html;
      const div = document.createElement('div');
      div.id = 'enhanced-content';
      div.innerHTML = html;
      document.body.append(div);
    }
  }
  try {
    js = await context.evaluate(addEnhancedContent);
    console.log(js);
  } catch (error) {
    console.log('Enhance content not loaded. Error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.com.au',
    zipcode: '',
  },
  implementation,
};
