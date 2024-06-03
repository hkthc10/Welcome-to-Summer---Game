const gamesContainer = document.querySelector("#games-container");
const gameForm = document.querySelector("#game-form");
const editModal = document.querySelector('.popup');
const editForm = document.querySelector("#edit-form");
let currentgameId = null;

const getCurrentUserData = () => JSON.parse(localStorage.getItem("current_user_data"));
const isAdmin = () => getCurrentUserData() === "buithaithinh69@gmail.com";
const isAuthor = (authorEmail) => getCurrentUserData() === authorEmail;

const addGame = (title, content, imgPath, tags) => {
  let user_data = getCurrentUserData();
  if (!title || !content || !tags || !imgPath) {
    alert("Please fill in all fields.");
    return;
  }
  db.collection("games")
    .add({
      author: user_data,
      title: title,
      content: content,
      imgPath: imgPath,
      tags: tags,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
      alert("Game added successfully!");
      fetchGames();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      alert("Failed to add game.");
    });
};

const deleteGame = (gameId) => {
  if (confirm("Are you sure you want to delete this game?")) {
    db.collection("games").doc(gameId).delete()
      .then(() => {
        alert("Game deleted successfully!");
        fetchGames();
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
        alert("Failed to delete game.");
      });
  }
};

const fetchGames = () => {
  db.collection("games").orderBy("createdAt", "desc").get()
    .then((querySnapshot) => {
      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });
      renderGames(games);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};


const renderGames = (games) => {
  const filteredGames = games.filter(game => isAuthor(game.author)); // Filter games where author is current user

  const html = filteredGames.map((game) => `
    <label class="game">
      <div>
        <h3>${game.author}</h3>
        <div class="box-zoom">
          <img src="${game.imgPath}" alt="" />
        </div>
        <h3>${game.title}</h3>
        <a>${game.tags}</a>
        <p class="tc">${game.content}</p>
        <button class="edit-game" onclick="openEditForm('${game.id}', '${game.title}', '${game.content}', '${game.imgPath}', '${game.tags}', '${game.author}')">Edit</button>
        <button class="delete-game" onclick="handleDelete('${game.id}', '${game.author}')">Delete</button>
      </div>
    </label>
  `).join("");
  gamesContainer.innerHTML = html;

  if (isAdmin()) {
    const html = games.map((game) => `
      <label class="game">
        <div>
          <h3>${game.author}</h3>
          <div class="box-zoom">
            <img src="${game.imgPath}" alt="" />
          </div>
          <h3>${game.title}</h3>
          <a>${game.tags}</a>
          <p class="tc">${game.content}</p>
          <button class="edit-game" onclick="openEditForm('${game.id}', '${game.title}', '${game.content}', '${game.imgPath}', '${game.tags}', '${game.author}')">Edit</button>
          <button class="delete-game" onclick="handleDelete('${game.id}', '${game.author}')">Delete</button>
        </div>
      </label>
    `).join("");
    gamesContainer.innerHTML = html;
  };
}

const handleDelete = (gameId, authorEmail) => {
  if (isAdmin() || isAuthor(authorEmail)) {
    deleteGame(gameId);
  } else {
    alert("You are not authorized to delete this game!");
  }
};

const closePopup = () => {
  editModal.classList.remove('show');
  document.querySelector('.overlay').classList.remove('show');
};

const updateGame = async (id, title, content, imgPath, tags) => {
  const updatedData = {
    title: title,
    content: content,
    imgPath: imgPath,
    tags: tags,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("games").doc(id).update(updatedData)
    .then(() => {
      alert("Game updated successfully!");
      fetchGames();
      closePopup();
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      alert("Failed to update game.");
    });
};

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#edit-title").value;
  const content = document.querySelector("#edit-content").value;
  const imgPath = document.querySelector("#edit-image").value;
  const tags = document.querySelector("#edit-tags").value;
  updateGame(currentgameId, title, content, imgPath, tags);
});

const openEditForm = (id, title, content, imgPath, tags, authorEmail) => {
  if (isAdmin() || isAuthor(authorEmail)) {
    currentgameId = id;
    document.querySelector("#edit-title").value = title;
    document.querySelector("#edit-content").value = content;
    document.querySelector("#edit-image").value = imgPath;
    document.querySelector("#edit-tags").value = tags;
    editModal.classList.add('show');
    document.querySelector('.overlay').classList.add('show');
  } else {
    alert("You are not authorized to edit this game!");
  }
};

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#game-title").value;
  const content = document.querySelector("#game-content").value;
  const imgPath = document.querySelector("#game-image").value;
  const tags = document.querySelector("#game-tags").value;
  addGame(title, content, imgPath, tags);
  gameForm.reset();
});

window.addEventListener("DOMContentLoaded", fetchGames);


auth.onAuthStateChanged((user) => {
  if (!user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    window.location.href = "index.html";
  }
});