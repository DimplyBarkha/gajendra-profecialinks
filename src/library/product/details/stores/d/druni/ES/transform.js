/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        })
      )
    )
  );

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.aggregateRating) {
          var baseObject = JSON.parse(row.aggregateRating[0].text);
          row.aggregateRating = [
            { text: baseObject.aggregateRating.ratingValue },
          ];
        }
        if (row.availabilityText) {
          if (row.availabilityText[0].text == "box-tocart unavailable") {
            // console.log("Out of stock");
            row.availabilityText = [{ text: "Out of stock" }];
          }
          if(row.availabilityText[0].text == "box-tocart"){
            // console.log("In stock");
            row.availabilityText = [{ text: "In stock" }];
          }
        }
      } catch (exception) {
        console.log("Error in transform", exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
