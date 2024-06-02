function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("input", function() {
        var val = this.value.trim();
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;

        // Split the input value by spaces and trim each part
        var values = val.split(' ').map(function(item) {
            return item.trim();
        });

        // Get the last part for autocompletion
        var lastValue = values[values.length - 1].replace('#', ''); // Remove '#' for comparison
        var remainingValues = values.slice(0, values.length - 1).map(function(item) {
            return item.startsWith('#') ? item : '#' + item; // Ensure each item starts with '#'
        }).join(' ');

        // Create a container for the autocomplete items
        var a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        // Iterate through the array and check if items start with the last part of the input
        arr.forEach(function(tag) {
            if (tag.substr(0, lastValue.length).toUpperCase() === lastValue.toUpperCase()) {
                var b = document.createElement("DIV");

                // Highlight the matching part
                b.innerHTML = "<strong>#" + tag.substr(0, lastValue.length) + "</strong>";
                b.innerHTML += tag.substr(lastValue.length);

                // Insert a hidden input with the full suggestion value
                b.innerHTML += "<input type='hidden' value='" + (remainingValues ? remainingValues + ' ' : '') + '#' + tag + "'>";

                // Add click event listener to fill the input field with the selected suggestion
                b.addEventListener("click", function() {
                    inp.value = this.getElementsByTagName("input")[0].value + " "; // Add a space after the suggestion
                    inp.focus();
                    closeAllLists();
                });
                a.appendChild(b);
            }
        });
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode === 38) {
            currentFocus--;
            addActive(x);
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

    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

var tags = ["Action", "Adventure", "Puzzle", "Strategy", "RPG", "Shooter", "Sports", "Racing", "Simulation", "Horror"];
autocomplete(document.getElementById("game-tags"), tags);
