/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      console.log("in row category", row.category);
      // console.log("row.additionalDescBulletInfo", row.additionalDescBulletInfo);
      console.log("row.descriptionBullets", row.descriptionBullets);
      console.log("row.description", row.description);
      console.log("row.largeImageCount", row.largeImageCount);
      console.log("row.ratingCount", row.ratingCount);
      console.log("row.specifications", row.specifications);
      console.log("row.aggregateRatingText", row.aggregateRatingText);
      console.log("row.nameExtended", row.nameExtended);
      if (row.category) {
        let breadcrumb = row.category[0].text;
        breadcrumb =
          breadcrumb.split(" ")[0] === "Home"
            ? breadcrumb.replace("Home ", "")
            : breadcrumb;
        breadcrumb = breadcrumb.replace(/\n \n/g, "|").trim();
        breadcrumb =
          breadcrumb.charAt(0) === "|"
            ? breadcrumb.replace("| ", "")
            : breadcrumb;
        row.category = [
          {
            text: breadcrumb,
            xpath: row.category[0].xpath,
          },
        ];
      }
      // if (row.additionalDescBulletInfo) {
      //   let text = "";
      //   row.additionalDescBulletInfo.forEach((el) => {
      //     text += el.text + " || ";
      //   });
      //   row.additionalDescBulletInfo = [
      //     {
      //       text: text.slice(0, -3).trim(),
      //     },
      //   ];
      // }
      if (row.descriptionBullets) {
        let info = row.descriptionBullets[0].text;
        row.descriptionBullets[0].text = info.split("\n \n").length;
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n/g, "");
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.ratingCount) {
        let pr = row.ratingCount[0].text;
        pr = pr.replace(/^\((.+)\)$/, "$1");
        row.ratingCount = [
          {
            text: pr,
            xpath: row.ratingCount[0].xpath,
          },
        ];
      }
      if (row.specifications) {
        let text = "";
        row.specifications.forEach((item) => {
          text += `${item.text.replace(/\n \n/g, "")} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.aggregateRatingText) {
        let ag = row.aggregateRatingText[0].text;
        ag = ag.split(" ")[0] === "Rated" ? ag.replace("Rated ", "") : ag;
        row.aggregateRatingText = [
          {
            text: ag,
            xpath: row.aggregateRatingText[0].xpath,
          },
        ];
      }
      if (row.nameExtended) {
        let firstWord = row.nameExtended[0].text;
        firstWord = firstWord.split(" ");
        row.nameExtended[0].text = row.nameExtended
          ? firstWord[0] +
            " - " +
            row.nameExtended[0].text +
            " - " +
            row.color[0].text
          : row.nameExtended[0].text;
      }
    }
  }
  return data;
};

module.exports = { transform };
