
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
    for (let row of group) {
      if (row.image) {
          row.image.forEach(item => {
              item.text = 'https://www.rei.com' + item.text              
          });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
            item.text = 'https://www.rei.com' + item.text              
        });
      }
      if (row.videos) {

        row.videos.forEach(item => {
            var json_obj = JSON.parse(item.text);
            json_obj.forEach(element => {
              
            });
            item.text = 'https://www.rei.com' + item.text              
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
