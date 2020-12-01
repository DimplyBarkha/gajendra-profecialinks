/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
        if (row.price) {
          row.price.forEach((element) => {
            element.text = element.text.substr(
              element.text.indexOf(" "),
              element.text.indexOf("₽") - 2
            );
          });
        }
        if (row.image) {
          row.image.forEach((element) => {
            element.text = element.text.substr(element.text.indexOf("'") + 1);
            element.text = element.text.substr(0, element.text.indexOf("'"));
          });
        }
        if (row.availabilityText) {
          let availabilityText = "";
          row.availabilityText.forEach((element) => {
            availabilityText = element.text ? "In Stock" : "Out of Stock";
          });
          row.availabilityText = [
            {
              text: availabilityText,
            },
          ];
        }
        if (row.description) {
          let text = "";
          row.description.forEach((item) => {
            text = row.description.map((elm) => elm.text).join(" | ");
          });
          row.description = [
            {
              text: text,
            },
          ];
        }
        if (row.category) {
          row.category.pop();
        }
        if (row.brandText) {
          row.brandText.forEach((element) => {
            element.text = element.text.replace(/\n/g, "");
            element.text = element.text.replace("Бренд: ", "").trim();
          });
        }
        if (row.manufacturer) {
          row.manufacturer.forEach((element) => {
            element.text = element.text.replace(/\n/g, "");
            element.text = element.text.replace("Производитель: ", "").trim();
          });
        }
        if (row.ingredientsList) {
          let text = "";
          row.ingredientsList.forEach((item) => {
            if (text.includes(item.text)) {
              text = text + item.text;
            }
          });
          row.ingredientsList = [
            {
              text: text,
            },
          ];
        }
        if (row.directions) {
          let text = "";
          row.directions.forEach((item) => {
            if (text.indexOf(item.text)) {
              text = text + item.text;
            }
          });
          row.directions = [
            {
              text: text,
            },
          ];
        }
        if (row.warnings) {
          let text = "";
          row.warnings.forEach((item) => {
            text = row.warnings.map((elm) => elm.text).join(" ");
          });
          row.warnings = [
            {
              text: text,
            },
          ];
        }
        if (row.numberOfServingsInPackage) {
          row.numberOfServingsInPackage.forEach((element) => {
            element.text = element.text
              .substr(element.text.indexOf(":") + 1)
              .trim();
          });
        }
        if (row.otherSellersName) {
          row.otherSellersName.forEach((element) => {
            element.text = element.text
              .substr(element.text.indexOf(":") + 1)
              .trim();
          });
        }
  
        Object.keys(row).forEach((header) =>
          row[header].forEach((el) => {
            el.text = clean(el.text);
          })
        );
      }
    }
    return data;
  };
  
  module.exports = { transform };
  