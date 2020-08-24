/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
        console.log('ffdewewewewfdfd')
      if (row.shippingInfo) {
        const text = [];
        row.shippingInfo.forEach(item => {
          text.push(item.text);
        });
        row.shippingInfo = [
          {
            text: text.join(' '),
          },
        ];
      }
      if (row.promotion) {
        const text = [];
        row.promotion.forEach(item => {
          text.push(item.text);
        });
        row.promotion = [
          {
            text: text.join(' '),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.includes('http') ? item.text : 'https:' + item.text;
        });
      }
      if (row.gtin) {
        let jsonStr = row.gtin[0].text.split('var product');
        jsonStr = jsonStr.length === 2 ? jsonStr[1].split(' = ') : [];
        jsonStr = jsonStr.length === 2 ? jsonStr[1].slice(0, -1) : '';
        const jsonObj = jsonStr.length ? JSON.parse(jsonStr) : '';
        const ean = Object.keys(jsonObj).length ? (jsonObj.ean ? jsonObj.ean : '') : '';
        row.gtin = [
          {
            text: ean,
          },
        ];

        if (row.eangtin) {
          row.eangtin = [
            {
              text: ean,
            },
          ];
        }
      }
      if (row.variants) {
        row.variants.forEach(item => {
          item.text = item.text.match(/(?<=-)(.*?)(?=\.)/gm) ? item.text.match(/(?<=-)(.*?)(?=\.)/gm)[0] : '';
          item.text = item.text.length ? (item.text.match(/[^-]+$/gm) ? item.text.match(/[^-]+$/gm)[0] : '') : '';
        });
      }
      if (row.firstVariant) {
        row.firstVariant.forEach(item => {
          item.text = item.text.match(/(?<=-)(.*?)(?=\.)/gm) ? item.text.match(/(?<=-)(.*?)(?=\.)/gm)[0] : '';
          item.text = item.text.length ? (item.text.match(/[^-]+$/gm) ? item.text.match(/[^-]+$/gm)[0] : '') : '';
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
