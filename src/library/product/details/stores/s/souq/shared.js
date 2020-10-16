
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.availabilityText) {
          let newText = 'Out of Stock';
          row.availabilityText.forEach(item => {
            if (item.text.includes('vip-instock')) {
              newText = 'In Stock';
            }
          });
          row.availabilityText = [{ text: newText }];
        }
        // if (row.listPrice) {
        //   row.listPrice.forEach(item => {
        //           item.text = item.text.replace('.00' , '').replace('EGP' , '')
        //   });
        // }
        if (row.alternateImages) {
          row.alternateImages.shift();
        }
        // if (row.variantId) {
        //   row.variantId.forEach(item => {
        //       item.text = item.text.split('/').reverse()[2].split('-').reverse()[0]
        //   });
        // }
        // if (row.description) {
        //   let text = '';
        //   row.description.forEach(item => {
        //     text = '||' + row.description.map(elm => elm.text).join(' ||');
        //   });
        //   row.description = [{ text }];
        // }
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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
  
    return data;
  };
  
  module.exports = { transform };
  