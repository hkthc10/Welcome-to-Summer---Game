function updateSearchBar() {
  const adventureChecked = document.getElementById('adventure').checked;
  const horrorChecked = document.getElementById('horror').checked;
  const roguelikeChecked = document.getElementById('roguelike').checked;
  const searchInput = document.getElementById('search-game');
  let searchQuery = '';

  // Append selected tags to searchQuery
  if (adventureChecked) {
    searchQuery += '#adventure';
  }
  
  if (horrorChecked) {
    searchQuery += (searchQuery ? ' ' : '') + '#horror';
  }

  if (roguelikeChecked) {
    searchQuery += (searchQuery ? ' ' : '') + '#rouguelike';
  }

  // Update search input value and trigger the filtering
  searchInput.value = searchQuery.trim();
  filterGames();
}

function filterGames() {
  const searchInput = document.getElementById('search-game').value.toLowerCase();
  const searchTerms = searchInput.split(' ').filter(term => term);
  const games = document.querySelectorAll('.game');

  games.forEach(game => {
    const title = game.querySelector('h3').innerText.toLowerCase();
    const tags = game.dataset.tags.toLowerCase().split(' ');

    const titleMatches = title.includes(searchInput);
    const tagsMatch = searchTerms.every(term => 
      tags.some(tag => tag.includes(term))
    );

    if (titleMatches || tagsMatch) {
      game.style.display = 'block';
    } else {
      game.style.display = 'none';
    }
  });
}
