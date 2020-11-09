/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        if (row.productSize) {
          row.name = [{ text: `${row.name[0].text} ${row.productSize[0].text}` }];
        };

        if (row.color) {
          row.name[0].text = row.name[0].text + row.color[0].text;
        }

        if (row.brandText) {
          row.name[0].text = row.brandText[0].text + ' ' + row.name[0].text;
        }
        row.nameExtended = [{ text: row.name[0].text }];
      }

      if (row.description) {
        if (row.additionalDescBulletInfo) {
          let ulString = '';
          for (let i = 0; i < row.additionalDescBulletInfo.length; i++) {
            ulString += `|| ${row.additionalDescBulletInfo[i].text} `;
          }
          row.description[0].text = `${row.description[0].text} ${ulString}`;
          row.additionalDescBulletInfo = [{ text: ulString }];
        }
      }
      if (row.listPrice) {
        row.listPrice[0].text = row.listPrice[0].text.replace(',', '').replace('.', ',');
      }

      if (row.sku) {
        const sku = row.sku[0].text;
        row.sku = [{ text: parseInt(sku) }];
      }

      if (row.variantId) {
        const variantId = row.variantId[0].text;
        row.variantId = [{ text: parseInt(variantId) }];
      }

      if (row.mpc) {
        row.mpc = [{ text: row.mpc[0].text.replace('Modelo', '') }];
      }

      if (row.variants) {
        const variants = row.variants;
        for (let i = 0; i < variants.length; i++) {
          variants[i].text = parseInt(variants[i].text);
        }
        row.variants = variants;
      }

      if (row.price) {
        row.price = [{ text: row.price[0].text.replace(/[.,]/g, function ($1) { return $1 === '.' ? ',' : '.'; }) }];
      }
    }
  }

  // Clean up data
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
