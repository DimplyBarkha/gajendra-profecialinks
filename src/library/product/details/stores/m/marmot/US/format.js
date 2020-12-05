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
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('&wid=180', '');
          item.text = item.text.replace('&hei=180', '');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('&wid=180', '');
          item.text = item.text.replace('&hei=180', '');
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace('Product Weight:', '');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('Sale Price', '');
          item.text = item.text.trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('Strikethrough List Price', '');
          item.text = item.text.trim();
        });
      }
      if (row.materials) {
        row.materials.forEach(item => {
          item.text = item.text.replace('Main Fabric:', '');
        });
      }
      if (row.nameExtended) {
        if (!row.brandText) {
          row.brandText = [{ text: 'Marmot' }];
        }
        if (row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.specifications) {
        var arrSpec = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\s*:\s*/g, ' : ');
          arrSpec.push(item.text);
        });
        row.specifications = [{ text: arrSpec.join(' || ') }];
      }
      if (row.additionalDescBulletInfo) {
        var arrBullet = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullet.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullet.join(' || ') }];
        row.descriptionBullets = [{ text: arrBullet.length }];
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };