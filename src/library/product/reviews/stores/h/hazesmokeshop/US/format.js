
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group } of data) {

    for (const row of group) {

      if (row.flavour) {
        row.flavour.forEach(item => {
          if (item.text.includes("Juul Pods")) {
            let split1 = item.text.split("Juul");
            item.text = `${split1[0]}`;
          }
          else if (item.text.includes("by MyBlu")) {
            let split1 = item.text.split("by");
            item.text = `${split1[0]}`;
          }
          else if (item.text.includes("Vuse ePod")) {
            let split1 = item.text.split("ePod");
            let split2 = `${split1[1]}`;
            if (split2.toLowerCase().trim() === "starter kit") {
              item.text = split2;
              item.text = '';
            }
          }
          else if (item.text.includes("Logic Pods –")) {
            let split1 = item.text.split("-");
            item.text = `${split1[1]}`;
          }
          else {
            item.text = '';
          }
        })
      }



    }
  }
  return data;
};

module.exports = { transform };

