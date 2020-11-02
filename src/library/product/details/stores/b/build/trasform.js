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
  let specs = [];
  let specsXPath = null;
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages = row.alternateImages.map((item) => ({
          ...item,
          text: item.text.replace("h_80", "h_450").replace("w_80", "w_450"),
        }));
      }
      // if (row.specifications) {
      //   for (const item of row.specifications) {
      //     specs.push(item.text.replace('\n', ':'));
      //     specsXPath = item.xpath;
      //   }
      //   // row.specifications = [{ text: specs, xpath: xpath }];
      // }
      // Object.keys(row).forEach(header => row[header].forEach(el => {
      //   el.text = clean(el.text);
      // }));
    }
  }

  return data;
};

module.exports = { transform };
