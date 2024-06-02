const gamesContainer = document.querySelector("#games-container");

let lastVisible = null;
const gamesPerPage = 9; // Number of games to load per page
let allGames = [];

const fetchGames = () => {
  let query = db.collection("games")
    .orderBy("createdAt", "desc")
    .limit(gamesPerPage);

  if (lastVisible) {
    query = query.startAfter(lastVisible);
  }

  query.get()
    .then((querySnapshot) => {
      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });

      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      // Nối các trò chơi mới được tìm nạp vào mảng allGames
      allGames = [...allGames, ...games];

      // Gọi renderGames với danh sách game được cập nhật
      renderGames(allGames);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

// Render data
const renderGames = (games) => {
  const html = games.map((game) => {
    return `
      <label class="game" data-tags="${game.tags}"  onclick="window.location.href = 'detail.html?id=${game.id}&author=${game.author}&imgPath=${game.imgPath}&title=${game.title}&content=${game.content}'">
        <div>
          <div class="box-zoom">
            <img src="${game.imgPath}" alt="" />
          </div>
          <h3>${game.title}</h3>
          <a>${game.tags}</a>
          <p class="tc">${game.content}</p>
        </div>
      </label>
    `;
  }).join("");
  gamesContainer.innerHTML = html;
};

// Tải các game ban đầu khi DOM tải
window.addEventListener("DOMContentLoaded", fetchGames);
