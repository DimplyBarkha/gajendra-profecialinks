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
      if (row.shownImages) {
        row.shownImages = row.shownImages.map((item) => ({
          ...item,
          text: item.text.replace("h_80", "h_1200").replace("w_80", "w_1200").replace("h_450", "h_1200").replace("w_450", "w_1200"),
        }));
      }
      if (row.highQualityImages) {
        row.highQualityImages = row.highQualityImages.map((item) => ({
          ...item,
          text: item.text.replace("h_80", "h_1200").replace("w_80", "w_1200").replace("h_450", "h_1200").replace("w_450", "w_1200"),
        }));
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }

  return data;
};

module.exports = { transform };
