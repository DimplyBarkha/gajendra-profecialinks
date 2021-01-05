/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      // .replace(/"\s{1,}/g, '"')
      // .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
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
      if (row.variantUrl) {
        var obj = {};

        for (var i = 0, len = row.variantUrl.length; i < len; i++) {
          obj[row.variantUrl[i]['text']] = row.variantUrl[i];
          console.log(
            (obj[row.variantUrl[i]['text']]),
            'p1'
          );
          console.log(
            (row.variantUrl[i]),
            'p2'
          );
        }
      }
      if (row.variantId) {
        var obj = {};

        for (var i = 0, len = row.variantId.length; i < len; i++) {
          obj[row.variantId[i]['text']] = row.variantId[i];
          console.log((obj[row.variantId[i]['text']] = row.variantId[i]), 'p');
        }

        //     row.variantId = new Array();
        // for ( var key in obj ) {
        //   row.variantId.push(obj[key]);
        // console.log(row.variantId.push(obj[key]) , 'row.variantId.push(obj[key])');
        // }
        // var t = row.variantId.filter((v,i,a)=>a.findIndex(t=>(t.text === v.text))===i)

        // console.log(row.variantId , 'variantId');
        // console.log(t , 'st');
        // row.variantId = row.variantId.filter(function (el) {
        //   // If it is not a duplicate, return true
        //   console.log(dups.indexOf(el.text) , 'dd');
        //   if (dups.indexOf(el.text) === -1) {
        //     dups.push(el.text);
        //     console.log(dups);
        //     return true;
        //   }

        //   return false;
        // });
      }
      if (row.description) {
        let text = '';
        row.description.forEach((item) => {
          text += item.text
            .replace(/\s{2,}/g, '')
            .replace(/\n/g, '')
            .trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.availabilityText) {
        let text = '';
        row.availabilityText.forEach((item) => {
          row.availabilityText = [
            {
              text:
                row.availabilityText[0].text === 'InStock'
                  ? 'In Stock'
                  : 'Out of Stock',
            },
          ];
        });
      }

      // if (row.variantInformation) {
      //   let text = '';
      //   row.variantInformation.forEach(item => {
      //     text += item.text+'|';
      //   });
      //   row.variantInformation = [
      //     {
      //       text: text.slice(0 , -1),
      //     },
      //   ];
      // }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item) => {
          text += item.text
            .replace(/\s{2,}/g, '')
            .replace(/\n/g, '')
            .trim();
        });
        row.specifications = [
          {
            text: text.slice(0, -2),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
