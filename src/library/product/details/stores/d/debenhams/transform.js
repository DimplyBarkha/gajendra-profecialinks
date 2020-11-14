/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const clean = (text) =>
      text
        .toString()
        .replace(/\r\n|\r|\n/g, " ")
        .replace(/&amp;nbsp;/g, " ")
        .replace(/&amp;#160/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, " ")
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, "")
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, " ");
    for (const { group } of data) {
      for (const row of group) {

        if(row.alternateImages) {
            row.alternateImages = row.alternateImages.map(x => ({
                ...x,
                text: `https:${x.text}`.replace("w=130", "w=1500").replace("h=130", "h=1500")
            }));
        }
        if (row.image) {
          row.image.forEach(element => {
            element.text = `https:${element.text}`
          });
        }
        if (row.variantInformation) {
          row.variantInformation.forEach(x => {
            x.text = x.text.split(",").join(" / ");
          });
        }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
    }
  
    return data;
  };
  
  module.exports = { transform };
  