// comment.js

// Function to add a comment to Firestore
function addComment(comment, gameId) {
    return new Promise((resolve, reject) => {
        db.collection('comments').add({
            gameId: gameId,
            author: user_data,
            comment: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(docRef => {
                resolve(docRef);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Function to format timestamp as relative time
function formatRelativeTime(timestamp) {
    const now = new Date();
    const commentTime = timestamp.toDate();
    const timeDifference = now.getTime() - commentTime.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
        return 'Just now';
    } else if (secondsDifference < 3600) {
        const minutes = Math.floor(secondsDifference / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (secondsDifference < 86400) {
        const hours = Math.floor(secondsDifference / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(secondsDifference / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Function to load comments from Firestore
function loadComments(gameId) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';  // Clear current comments

    db.collection('comments')
        .where('gameId', '==', gameId)
        .get()
        .then(snapshot => {
            const comments = [];
            snapshot.forEach(doc => {
                comments.push(doc.data());
            });
            // Sort comments by timestamp in descending order
            comments.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
            // Display comments
            comments.forEach(commentData => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p>${commentData.author}</p>
                    <p>${commentData.comment}</p>
                    <small>${commentData.timestamp ? formatRelativeTime(commentData.timestamp) : new Date(commentData.timestamp.toDate()).toLocaleString()}</small>
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => {
            console.error('Error loading comments: ', error);
        });
}


// Event listener for comment submission
document.getElementById('submitComment').addEventListener('click', function () {
    const commentInput = document.getElementById('commentInput');
    const comment = commentInput.value.trim();
    const gameId = new URLSearchParams(window.location.search).get('id');

    if (comment === '') {
        alert('Please enter a comment');
        return;
    }

    addComment(comment, gameId)
        .then(() => {
            commentInput.value = '';
            loadComments(gameId);  // Refresh the comments
        })
        .catch(error => {
            console.error('Error adding comment: ', error);
        });
});

// Load comments on page load
window.addEventListener('load', function () {
    const gameId = new URLSearchParams(window.location.search).get('id');
    loadComments(gameId);
});
