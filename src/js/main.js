const gamesContainer = document.querySelector("#games-container");
const gameForm = document.querySelector("#game-form");
const editModal = document.querySelector('.popup');
const editForm = document.querySelector("#edit-form");

// Hàm thêm game
const addGame = (title, content, imgPath, tags) => {
  let user_data = JSON.parse(localStorage.getItem("current_user_data"));
  if (!title || !content || !tags || !imgPath) {
    alert("Please fill in all fields.");
    return;
  }
  db.collection("games")
    .add(
      {
        author: user_data,
        title: title,
        content: content,
        imgPath: imgPath,
        tags: tags,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }
    )
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      alert("Game added successfully!");
      fetchGames();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      alert("Failed to add game.");
    });
};


// Hàm xóa game
const deleteGame = (gameId) => {
  if (confirm("Ban chac chan muon xoa")) {
    db.collection("games")
      .doc(gameId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        alert("Game deleted successfully!");
        fetchGames()
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
        alert("Failed to delete game.");
      });
  }
};

// Hàm lấy danh sách game từ Firebase về
const fetchGames = () => {
  db.collection("games")
    .orderBy("createdAt", "desc")
    .get()
    .then((querySnapshot) => {
      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });

      // Gọi hàm để render
      renderGames(games);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

// Render dữ liệu cho phần eđit
const renderGames = (games) => {
  const html = games.map((game) => {
    return `
      <label class="game">
        <div>
        <h3>${game.author}</h3>
          <div class="box-zoom">
            <img src="${game.imgPath}" alt="" />
          </div>
          <h3>${game.title}</h3>
          <a>${game.tags}</a>
          <p class="tc">${game.content}</p>
          <button class="edit-game" onclick="openEditForm('${game.id}', '${game.title}', '${game.content}', '${game.imgPath}', '${game.tags}')">Edit</button>
          <button class="" onclick="deleteGame('${game.id}')">Delete</button>
        </div>
      </label>
    `
  }).join("");
  gamesContainer.innerHTML = html;
};


// Function to open the edit form
const openEditForm = (id, title, content, imgPath, tags) => {
  currentgameId = id;
  document.querySelector("#edit-title").value = title;
  document.querySelector("#edit-content").value = content;
  document.querySelector("#edit-image").value = imgPath;
  document.querySelector("#edit-tags").value = tags;
  document.querySelector('.popup').classList.add('show');
  document.querySelector('.overlay').classList.add('show');
};

// Function to close the edit form
const closePopup = () => {
  document.querySelector('.popup').classList.remove('show');
  document.querySelector('.overlay').classList.remove('show');
};

// Function to update a game
const updateGame = async (id, title, content, imgPath, tags) => {
  const updatedData = {
    title: title,
    content: content,
    imgPath: imgPath,
    tags: tags,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  console.log(updatedData);

  db.collection("games")
    .doc(id)
    .update(updatedData)
    .then(() => {
      console.log("Document successfully updated!");
      alert("Game updated successfully!");
      fetchGames();
      closePopup();
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      alert("Failed to update game.");
    });
};

// Thêm game
gameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#game-title").value;
  const content = document.querySelector("#game-content").value;
  const imgPath = document.querySelector("#game-image").value;
  const tags = document.querySelector("#game-tags").value;
  addGame(title, content, imgPath, tags);
  gameForm.reset();
});

// Event listener to handle form submission for editing a game
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#edit-title").value;
  const content = document.querySelector("#edit-content").value;
  const imgPath = document.querySelector("#edit-image").value;
  const tags = document.querySelector("#edit-tags").value;
  updateGame(currentgameId, title, content, imgPath, tags);
});


// Lắng nghe sự kiện: Nếu DOM của tất cả file đã được load 
window.addEventListener("DOMContentLoaded", fetchGames);