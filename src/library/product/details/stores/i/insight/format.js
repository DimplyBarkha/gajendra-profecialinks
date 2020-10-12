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
        if (row.alternateImages) {
          let alternateImages_info = [];
          row.alternateImages.forEach(item => {
            alternateImages_info.push(item.text);
          });
          if (alternateImages_info.length) {
            row.alternateImages = [{ "text": "| " + alternateImages_info.join(" | ") }];
          }
        }
        if (row.description) {
            let description_info = [];
            row.description.forEach(item => {
              item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
              description_info.push(item.text);
            });
        }
        if (row.specifications) {
            let specifications_info = [];
            row.specifications.forEach(item => {
                specifications_info.push(item.text);
            });
            if (specifications_info.length) {
              row.specifications = [{ "text": "|| " + specifications_info.join(" || ") }];
            }
          }
      }
    }
    return cleanUp(data);
  }; 
  module.exports = { transform };