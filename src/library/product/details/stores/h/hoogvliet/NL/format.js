
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/Productinformatie\n/g, '').trim();
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
          item.text = item.text.replace(/:\s*:/g, ':').trim();
          item.text = item.text.replace(/\n/g, ' || ').trim();
        });
      }
      if (row.additionalDescBulletInfo) {
        var bulletInfo = [];
        row.additionalDescBulletInfo.forEach(item => {
          bulletInfo.push(item.text);
        });
        if (bulletInfo.length) {
          row.additionalDescBulletInfo = [{ text: '|| ' + bulletInfo.join(' || ') }];
          row.descriptionBullets = [{ text: bulletInfo.length }];
        }
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/\s+/g, '');
          item.text = item.text.replace('.', ',');
          item.text = item.text.trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/\s+/g, '');
          item.text = item.text.replace('.', ',');
          item.text = item.text.trim();
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = item.text.replace('Prijs per:', '');
          item.text = item.text.replace('.', ',');
          item.text = item.text.trim();
        });
      }
      if (row.pricePerUnitUom) {
        row.pricePerUnitUom.forEach(item => {
          item.text = item.text.replace('Prijs per:', '');
          item.text = item.text.trim();
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };