const createSearchUrl = () => {
  var newElement = document.createElement('DIV');
  newElement.setAttribute('class', 'page-link');
  newElement.innerHTML = window.location.href;
  document.body.appendChild(newElement);
  const productTiles = document.querySelectorAll('.products_list-item');
  productTiles.forEach((tile) => {
    tile.scrollIntoView();
  });
};
module.exports = { createSearchUrl };
