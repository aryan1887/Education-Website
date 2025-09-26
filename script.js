$(document).ready(function () {
  // Scroll animation for hero or nav link
  $(".nav-link").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      const hash = this.hash;
      $("html, body").animate({
        scrollTop: $(hash).offset()?.top - 80
      }, 800);
    }
  });
});

$(document).ready(function () {
  // Animate numbers
  $('.counter').each(function () {
    const $this = $(this), countTo = $this.attr('data-count');
    $({ countNum: $this.text() }).animate({
      countNum: countTo
    }, {
      duration: 2000,
      easing: 'swing',
      step: function () {
        $this.text(Math.floor(this.countNum));
      },
      complete: function () {
        $this.text(this.countNum);
      }
    });
  });
});

$(document).ready(function () {
  // Course filtering
  $(".filter-group .btn").on("click", function () {
    const filter = $(this).attr("data-filter");

    $(".filter-group .btn").removeClass("active");
    $(this).addClass("active");

    if (filter === "all") {
      $(".course-item").show();
    } else {
      $(".course-item").hide();
      $(".course-item." + filter).fadeIn();
    }
  });
});


//chatbox(contact us)
$('#contactForm').on('submit', function (e) {
  e.preventDefault();
  alert('Thank you! Your message has been sent.');
  $('#contactForm')[0].reset();
});

function sendChatMessage() {
  const input = $('#chatInput');
  const msg = input.val().trim();
  if (msg !== '') {
    $('#chatBody').append(`<div><strong>You:</strong> ${msg}</div>`);
    input.val('');
    $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
  }
}



const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let hasError = false;

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("agreeTerms").checked;

    // Clear errors
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    // Validations
    if (fullName === "") {
      document.getElementById("nameError").textContent = "Full name is required.";
      hasError = true;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email)) {
      document.getElementById("emailError").textContent = "Enter a valid email.";
      hasError = true;
    }

    if (username.length < 4) {
      document.getElementById("usernameError").textContent = "Username must be at least 4 characters.";
      hasError = true;
    }

    if (password.length < 6) {
      document.getElementById("passwordError").textContent = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (password !== confirmPassword) {
      document.getElementById("confirmError").textContent = "Passwords do not match.";
      hasError = true;
    }

    if (!terms) {
      document.getElementById("termsError").textContent = "You must agree to the terms.";
      hasError = true;
    }

    if (!hasError) {
      // Send data to register.php via AJAX
      $.ajax({
        url: "register.php",
        type: "POST",
        dataType: "json",
        data: {
          fullname: fullName,
          email: email,
          username: username,
          password: password,
          confirmPassword: confirmPassword
        },
        success: function (response) {
          if (response.status === "success") {
            alert(response.message);
            window.location.href = "signin.html";
          } else {
            alert(response.message);
          }
        },
        error: function () {
          alert("Something went wrong. Please try again later.");
        }
      });
    }
  });
}

$(document).ready(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    $(".alert").remove();

    let email = $("#loginEmail").val().trim();
    let password = $("#loginPassword").val().trim();

    $.ajax({
      url: "signin.php",
      type: "POST",
      data: {
        email: email,
        password: password
      },
      dataType: "json",
      success: function (response) {
        if (response.status === "success") {
          // Save name to localStorage
          localStorage.setItem("userFullName", response.name);

          alert(`Welcome ${response.name}! You have successfully signed in.`);

          // Redirect to dashboard
          window.location.href = "dashboard.html";
        } else {
          $("#loginForm").append(
            `<div class="alert alert-danger mt-3" role="alert">${response.message}</div>`
          );
        }
      },
      error: function () {
        alert("Something went wrong. Please try again.");
      }
    });
  });
});




// Form submission
$("#editUserForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#editUserId").val();
  const fullname = $("#editFullName").val().trim();
  const email = $("#editEmail").val().trim();
  const username = $("#editUsername").val().trim();

  $.ajax({
    url: "update_user.php",
    type: "POST",
    data: { id, fullname, email, username },
    dataType: "json",
    success: function (res) {
      if (res.status === "success") {
        alert("User updated successfully!");
        $('#editUserModal').modal('hide');
        loadUsers(); // refresh table
      } else {
        alert(res.message);
      }
    },
    error: function () {
      alert("An error occurred while updating.");
    }
  });
});

// ========== Dashboard Page Specific ==========

// Global loadUsers function so it's reusable after update
function loadUsers() {
  $.ajax({
    url: "get_users.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      if (res.status === "success") {
        let rows = "";
        res.data.forEach(user => {
          rows += `
            <tr data-id="${user.id}">
              <td>${user.id}</td>
              <td>${user.fullname}</td>
              <td>${user.email}</td>
              <td>${user.username}</td>
              <td>
                <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
              </td>
            </tr>`;
        });
        $("#userTable tbody").html(rows);
      } else {
        alert("Failed to load users.");
      }
    }
  });
}





// Edit button handler with confirmation popup
$(document).on("click", ".edit-btn", function () {
  const confirmEdit = confirm("Do you want to edit this user?");
  
  if (!confirmEdit) {
    return; // 🛑 Stop here if user clicks "Cancel"
  }

  const row = $(this).closest("tr");
  const id = row.data("id");
  const fullName = row.find("td:nth-child(2)").text();
  const email = row.find("td:nth-child(3)").text();
  const username = row.find("td:nth-child(4)").text();

  $("#editUserId").val(id);
  $("#editFullName").val(fullName);
  $("#editEmail").val(email);
  $("#editUsername").val(username);

  const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
  modal.show(); // ✅ Show modal only if user confirms
});

// Submit handler for edit form
$("#editUserForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#editUserId").val();
  const fullname = $("#editFullName").val().trim();
  const email = $("#editEmail").val().trim();
  const username = $("#editUsername").val().trim();

  $.ajax({
    url: "update_user.php",
    type: "POST",
    data: { id, fullname, email, username },
    dataType: "json",
    success: function (res) {
      if (res.status === "success") {
        alert("User updated successfully!");
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
        loadUsers(); // refresh user table
      } else {
        alert(res.message || "Update failed.");
      }
    },
    error: function () {
      alert("An error occurred while updating.");
    }
  });
});



function loadUsers() {
  $.ajax({
    url: "get_users.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      if (res.status === "success") {
        let rows = "";
        res.data.forEach(user => {
          rows += `
            <tr data-id="${user.id}">
              <td>${user.id}</td>
              <td>${user.fullname}</td>
              <td>${user.email}</td>
              <td>${user.username}</td>
              <td>
                <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
              </td>
            </tr>`;
        });
        $("#userTable tbody").html(rows);
      } else {
        alert("Failed to load users.");
      }
    },
    error: function () {
      alert("Error loading users.");
    }
  });
}


$(document).ready(function () {
  const userName = localStorage.getItem("userName");
  $("#welcomeMsg").text(`Hello ${userName}, welcome to your dashboard`);

  loadUsers(); // This refreshes the user table when page loads
});
