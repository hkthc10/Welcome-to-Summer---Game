const gamesContainer = document.querySelector("#games-container");
const loadMoreBtn = document.getElementById("loadmore");

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

      // Nếu nhiều Game được lấy ra hơn giới hạn thì sẽ ẩn nút Loadmore
      if (games.length < gamesPerPage) {
        loadMoreBtn.style.display = "none";
      }
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

// Hiện ra nhiều game hơn
loadMoreBtn.addEventListener("click", () => {
  fetchGames();
  loadMoreBtn.style.display = "none"; // Ẩn khi ấn xong
});

// Hiện Tự động điền tag
function autocomplete(inp, arr) {
  var currentFocus;

  inp.addEventListener("input", function () {
    var val = this.value.trim();
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;

    // Tách giá trị đầu vào bằng dấu cách và loại bỏ khoảng trống ở mỗi phần
    var values = val.split(' ').map(function (item) {
      return item.trim();
    });

    // Lấy phần cuối cùng để tự động điền
    var lastValue = values[values.length - 1].replace('#', ''); // Loại bỏ '#' để so sánh
    var remainingValues = values.slice(0, values.length - 1).map(function (item) {
      return item.startsWith('#') ? item : '#' + item; // Đảm bảo mỗi mục bắt đầu bằng '#'
    }).join(' ');

    // Tạo một container cho các mục tự động điền
    var a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);

    // Lặp qua mảng và kiểm tra xem các mục có bắt đầu bằng phần cuối của đầu vào không
    arr.forEach(function (tag) {
      if (tag.substr(0, lastValue.length).toUpperCase() === lastValue.toUpperCase()) {
        var b = document.createElement("DIV");

        // Đánh dấu phần khớp
        b.innerHTML = "<strong>#" + tag.substr(0, lastValue.length) + "</strong>";
        b.innerHTML += tag.substr(lastValue.length);

        // Chèn một input ẩn với giá trị đầy đủ của gợi ý
        b.innerHTML += "<input type='hidden' value='" + (remainingValues ? remainingValues + ' ' : '') + '#' + tag + "'>";

        // Thêm sự kiện click để điền trường nhập với gợi ý đã chọn
        b.addEventListener("click", function () {
          inp.value = this.getElementsByTagName("input")[0].value + " "; // Thêm một khoảng trống sau gợi ý
          inp.focus();
          closeAllLists();
        });
        a.appendChild(b);
      }
    });
  });

  inp.addEventListener("keydown", function (e) {
    // Lấy danh sách các mục tự động hoàn thành:
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    
    // Xử lý khi nhấn phím xuống (Arrow Down keycode = 40):
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x); // Làm nổi bật mục hiện tại

      // Xử lý khi nhấn phím lên (Arrow Up keycode = 38):
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x); // Làm nổi bật mục hiện tại

      // Xử lý khi nhấn phím Enter (keycode = 13):
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

var tags = ["Action", "Adventure", "Puzzle", "Strategy", "RPG", "Shooter", "Sports", "Racing", "Simulation", "Horror"];
autocomplete(document.getElementById("search-game"), tags);
