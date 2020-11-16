/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        for (let i = 0; i < row.description.length; i++) {
          row.description[i].text = `|| ${row.description[i].text}`;
        }
      }

      if (row.variants) {
        for (let i = 0; i < row.variants.length; i++) {
          row.variants[i].text = `| ${row.variants[i].text}`;
        }
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = `|| ${row.additionalDescBulletInfo[0].text}`;
      }

      if (row.specifications) {
        let specText = '';
        for (let i = 0; i < row.specifications.length; i++) {
          specText += `|| ${row.specifications[i].text} `;
        }
        row.specifications = [{ text: specText }];
      }

      if (row.variantId) {
        let variantId = row.variantId[0].text;
        variantId = variantId.substring(variantId.lastIndexOf('-') + 1, variantId.lastIndexOf('.'));
        row.variantId = [{ text: variantId }];
      }

      if (row.materials) {
        const material = row.materials[0].text;
        if (material.trim() === 'N/A') {
          delete row.materials;
        }
      }

      if (row.price) {
        let price = row.price[0].text;
        if (price.includes('-')) {
          price = price.split('-')[0];
          row.price[0].text = price;
        }
      }

      if (row.listPrice) {
        let price = row.listPrice[0].text;
        if (price.includes('-')) {
          price = price.split('-')[0];
          row.listPrice[0].text = price;
        }
      }
    }
  }

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
