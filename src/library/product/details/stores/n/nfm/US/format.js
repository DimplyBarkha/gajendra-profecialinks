/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = text => text.toString()
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
      if (row.category) {
        if (row.category[0].text === 'Home') {
          row.category.shift();
        }
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach((el) => {
          text += el.text.replace(/\n \n/g, '||');
        });
        row.additionalDescBulletInfo = [
          {
            text: cleanUp(text.slice(0, -3).trim()),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n \n/g, ' || ').trim();
        });
        row.description = [
          {
            text: cleanUp(text),
          },
        ];
      }



      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          if (!item.text.includes('hideMenu') && item.text !== 'Video') {
            text += item.text.replace(/\\/g, '').replace('Video', '');
          }
        });
        row.manufacturerDescription = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
        if (row.secondaryImageTotal) {
          row.secondaryImageTotal = [
            {
              text: cleanUp(row.alternateImages.length),
            },
          ];
        }
      }
      if (row.ratingCount) {
        let pr = row.ratingCount[0].text;
        pr = pr.replace(/^\((.+)\)$/, '$1');
        row.ratingCount = [
          {
            text: cleanUp(pr),
            xpath: row.ratingCount[0].xpath,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item) => {
          text += `${item.text.replace(/\n \n/g, '')} || `;
        });
        row.specifications = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.inTheBoxText || row.inTheBoxText2) {
        // console.log('BOX DATA', row.inTheBoxText)
        var arr = [];
        if (row.inTheBoxText.length > 0) {
          row.inTheBoxText.forEach(item => {
            arr.push(item.text)

          })
          let uniq = [...new Set(arr)];
          console.log('+++++++++++++++++++++++', uniq);
          row.inTheBoxText.text = uniq.join(" || ")
        }
        else if (row.inTheBoxText2.length > 0) {
          row.inTheBoxText2.forEach(item => {
            arr.push(item.text)

          })
          let uniq = [...new Set(arr)];
          console.log('+++++++++++++++++++++++', uniq);
          row.inTheBoxText.text = uniq.join(" || ")

        }


      }
      if (row.aggregateRatingText) {
        let ag = row.aggregateRatingText[0].text;
        ag = ag.split(' ')[0] === 'Rated' ? ag.replace('Rated ', '') : ag;
        row.aggregateRatingText = [
          {
            text: cleanUp(ag),
            xpath: row.aggregateRatingText[0].xpath,
          },
        ];
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text += `Color: ${item.text} | `;
        });
        row.variantInformation = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variants) {
        let text = '';
        if (row.variants.length > 1) {
          row.firstVariant = row.variantId;
        }
        row.variants.forEach(item => {
          text += `${item.text} | `;
        });
        row.variants = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
     /* if(row.hasComparisonTable){
    var arr = [] ;
    var text = '';
        row.hasComparisonTable.forEach(item =>{
          console.log("here is loggggg....",item);
         arr.push(item.text);

        arr.forEach(item =>{
          console.log("here is arr",arr);
          if(item.text ==='Comparison Chart'){
            console.log("here is my items",item.text )
            row.hasComparisonTable= [
              {
                text: "Yes"
              }
            ]

          }
          else{
            row.hasComparisonTable= [
              {
                text: "No"
              }
            ]
          }
        })
        })


      }*/
    }


  }
  return data;
};

module.exports = { transform };
