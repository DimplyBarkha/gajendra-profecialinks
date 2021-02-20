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
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace('Art.', '');
          item.text = item.text.trim();
        });
        row.variantId = [{ text: row.sku[0].text }];
      }
      if (row.price1 && row.price2) {
        row.price2.forEach(item => {
          item.text = item.text.replace(',', '');
        });
        row.price = [{ text: row.price1[0].text + row.price2[0].text }];
        if (row.price3) {
          row.price = [{ text: row.price[0].text + '.' + row.price3[0].text }];
          delete row.price3;
        }
        delete row.price1;
        delete row.price2;
      }
      if (row.listPrice1 && row.listPrice2) {
        row.listPrice1.forEach(item => {
          item.text = item.text.replace(',', '');
        });
        row.listPrice = [{ text: row.listPrice1[0].text + '.' + row.listPrice2[0].text }];
        delete row.listPrice1;
        delete row.listPrice2;
      }
      if (row.additionalDescBulletInfo) {
        var arrBullet = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullet.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullet.join(' || ') }];
        row.descriptionBullets = [{ text: arrBullet.length }];
      }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace('\n', ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.sams.com.mx' + item.text;
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('img_icon', 'img_large');
          item.text = item.text.replace('i.jpg', 'l.jpg');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('img_icon', 'img_large');
          item.text = item.text.replace('i.jpg', 'l.jpg');
        });
      }
      if (row.calciumPerServing) {
        row.calciumPerServing.forEach(item => {
          if(item.text.includes('%')){
          item.text = item.text.replace('%', '');
          }
          else{
            item.text = item.text;
          }
        });
      }
      if (row.calciumPerServingUom) {
        row.calciumPerServingUom.forEach(item => {
          if(item.text.includes('%')){
          item.text = item.text.slice(-1);
          }
          else{
            item.text = '';
          }
        });
      }
      if (row.totalFatPerServing) {
        row.totalFatPerServing.forEach(item => {
          if(item.text.includes('%')){
          item.text = item.text.replace('%', '');
          }
          else{
            item.text = item.text;
          }
        });
      }
      if (row.totalSugarsPerServing) {
        row.totalSugarsPerServing.forEach(item => {
          if(item.text.includes('g')){
          item.text = item.text.replace('g', '');
          }
          else{
            item.text = item.text;
          }
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if(item.text=== 'true'){
          item.text = 'In Stock';
          }
          else{
            item.text = 'Out of Stock';
          }
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
