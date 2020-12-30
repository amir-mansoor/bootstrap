const error = document.getElementById("error");
const error2 = document.getElementById("error2");

class Comment {
	constructor(name, comment, id) {
		this.name = name;
		this.comment = comment;
		this.id = id;

	}
}

class UI {
	static DisplayComments() {
		const commentData = Storage.getComments();
		commentData.forEach((comment) => UI.addCommentToList(comment));
	}

	static addCommentToList(comment) {
		const list = document.getElementById("comment_list");
		const row = document.createElement("tr");

		row.innerHTML = `
			<td>${comment.name}</td>
			<td>${comment.comment}</td>
			<td>${comment.id}</td>
			<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>

		`;
		list.appendChild(row);
	}

	static clearFields() {
		document.getElementById("name").value = "";
		document.getElementById("comment_msg").value = "";
		document.getElementById("id").value = "";
	}

	static deleteComment(el) {
		if (el.classList.contains("delete")) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement("div");
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.getElementById("container");
		const form = document.getElementById("comment_form");
		container.insertBefore(div, form);
		setTimeout(() => document.querySelector(".alert").remove(), 3000);
	}
}

class Storage {

	static getComments() {
		let comments;
		if (localStorage.getItem("Comments") === null) {
			comments = [];
		} else {
			comments = JSON.parse(localStorage.getItem("Comments"));
		}

		return comments;
	}

	static addComment(comment) {
		const comments = Storage.getComments();

		comments.push(comment);

		localStorage.setItem("Comments", JSON.stringify(comments));
	}

	static removeComment(id) {
		const comments = Storage.getComments();

		comments.forEach((comment, index) => {
			if (comment.id === id) {
				comments.splice(index, 1);
			}
		});

		localStorage.setItem("Comments", JSON.stringify(comments));
	}
}


// Event to display comments 

document.addEventListener("DOMContentLoaded", UI.DisplayComments);

// Add Comment
document.getElementById('comment_form').addEventListener("submit", (e) => {
	e.preventDefault();
	const name = document.getElementById("name").value;
	const comment_msg = document.getElementById("comment_msg").value;
	const id = document.getElementById("id").value;

	if (name === "" || comment_msg === "" || id === "") {
		UI.showAlert("Please Fill In All Fields", "danger");
	} else {

		// Instatiate
		const comment = new Comment(name, comment_msg, id);
		// Add Comment To List
		UI.addCommentToList(comment);

		// Add Comment to Local Storage
		Storage.addComment(comment);


		// Show success message
		UI.showAlert("The Comment is Added Successfully", "success");

		// Clear Fields
		UI.clearFields();
	}
});

// Remove a comment
document.getElementById("comment_list").addEventListener("click", (e) => {
	// Delete Comment From UI
	UI.deleteComment(e.target);

	// Delete Comment From Local Storage
	Storage.removeComment(e.target.parentElement.previousElementSibling.textContent);

	// show to remove comment message
	UI.showAlert("The Comment is Removes Successfully", "success");
});
