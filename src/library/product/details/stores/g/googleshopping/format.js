/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const specs = [];
        let txt = '';
        row.description.forEach(item => {
          specs[0] = item;
          if (txt.length > 0) {
            txt = txt + ' || ';
          }
          txt = txt + item.text;
          specs[0].text = txt;
        });
        row.description = specs;
      }
      if (row.addedDesc) {
        const descs = [];
        let txt = '';
        row.addedDesc.forEach(item => {
          descs[0] = item;
          if (txt.length > 0) {
            txt = txt + ' || ';
          }
          txt = txt + item.text;
          descs[0].text = txt;
        });
        row.description = descs;

        let cntObj;
        row.addedDescCnt.forEach(item => {
          cntObj = item;
        });
        row.descriptionBullets.forEach(item => {
          item.text = cntObj.text;
        });
      }

      if (row.specifications) {
        const specs = [];
        let txt = '';
        row.specifications.forEach(item => {
          specs[0] = item;
          if (txt.length > 0) {
            txt = txt + ' || ';
          }
          txt = txt + item.text;
          specs[0].text = txt;
          // item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
        row.specifications = specs;
      }
      if (row.variants) {
        const vars = [];
        let cnt = 0;
        const params = [];
        row.variants.forEach(item => {
          vars[0] = item;
          let txt = item.text;
          if (txt.indexOf('/shopping/product/') > -1) {
            txt = txt.replace('/shopping/product/', '');
          }
          const idx = txt.indexOf('?prds');
          if (idx > -1) {
            txt = txt.substring(0, idx);
          }
          item.text = txt;
          params[cnt] = txt;
          cnt++;
        });
        vars.forEach(item => {
          item.text = params.join('|');
        });
        row.variants = vars;
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          let txt = item.text;
          const idx = txt.indexOf('?');
          if (idx > -1) {
            txt = txt.substring(0, idx);
          }
          if (txt.indexOf('/') > -1) {
            txt = txt.substring(txt.lastIndexOf('/') + 1);
          }          
          item.text = txt;
        });
      }
      if (row.shippingInfo) {
        const vars = [];
        let cnt = 0;
        const params = [];
        row.shippingInfo.forEach(item => {
          vars[0] = item;
          params[cnt] = item.text;
          cnt++;
        });
        vars.forEach(item => {
          item.text = params.join('|');
        });
        row.shippingInfo = vars;
      }

      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.split(',')[0];
        });
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
