var tiles;

function loadTiles() {
  tiles = document.querySelectorAll(".interestingLink");
}

function updateSearch(e) {
  const searchValue = e.target.value.toLowerCase().trim();
  for (let tile of tiles) {
    if (!searchValue || tile.innerText.toLowerCase().includes(searchValue)) {
      tile.style.display = '';
    } else {
      tile.style.display = 'none';
    }
  }
}