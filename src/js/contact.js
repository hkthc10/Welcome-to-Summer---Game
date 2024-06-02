const contactForm = document.querySelector("#form-contact");
const contactContainer = document.querySelector("#contact-container");

// Function to add a contact
const addContact = (name, email, subject, message) => {
    let user_data = JSON.parse(localStorage.getItem("current_user_data"));
    if (!name || !email || !message || !subject) {
        alert("Please fill in all fields.");
        return;
    }
    db.collection("contacts")
        .add(
            {
                author: user_data,
                name: name,
                email: email,
                subject: subject,
                message: message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }
        )
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            alert("Contact added successfully!");
            fetchContacts();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert("Failed to add contact.");
        });
};

// Function to fetch contacts from Firebase
const fetchContacts = () => {
    db.collection("contacts")
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
            const contacts = [];
            querySnapshot.forEach((doc) => {
                contacts.push({ id: doc.id, ...doc.data() });
            });

            // Render the contacts
            renderContacts(contacts);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
};

// Function to render contacts
const renderContacts = (contacts) => {
    if (contactContainer) {
        const html = contacts.map((contact) => {
            return `
                <label class="contact">
                    <div>
                        <h3>Tác giả: ${contact.author}</h3>
                        <h3>Tiêu đề: ${contact.subject}</h3>
                        <a>${contact.message}</a>
                        <p class="tc">${contact.email}</p>
                    </div>
                </label>
            `;
        }).join("");
        contactContainer.innerHTML = html;
    }
};

if (contactForm) {
    // Event listener for submitting the contact form
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("#contact-name").value;
        const email = document.querySelector("#contact-email").value;
        const subject = document.querySelector("#contact-subject").value;
        const message = document.querySelector("#contact-message").value;
        addContact(name, email, subject, message);
        contactForm.reset();
    });
}


// Listen for DOMContentLoaded event to fetch contacts
window.addEventListener("DOMContentLoaded", fetchContacts);
