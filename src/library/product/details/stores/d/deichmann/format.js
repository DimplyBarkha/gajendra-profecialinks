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
        if (row.specifications) {
          let specs = '';
          let xpath = ''
          for (const item of row.specifications) {
            specs += clean(item.text.replace('\n', ':').replace("\n","").replace("\n","")) + ' || ';
            xpath = item.xpath;
          }
          row.specifications = [{ text: specs, xpath: xpath }];
        }
        if (row.imageZoomFeaturePresent) {
          if (row.imageZoomFeaturePresent.length) {
            row.imageZoomFeaturePresent[0].text = 'Yes';
          } else {
            row.imageZoomFeaturePresent = [{ text: 'No', xpath: '' }];
          }
        }
        
      }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }))));
    return data;
  };
  
  module.exports = { transform };