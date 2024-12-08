 // Select all necessary elements
const signUp = document.getElementById('sign-up'),
      signIn = document.getElementById('sign-in'),
      resetPass = document.getElementById('reset-pass'),
      backToLogin = document.getElementById('back-to-login'),
      backToRequestReset = document.getElementById('back-to-request-reset'),
      loginIn = document.getElementById('login-in'),
      loginUp = document.getElementById('login-up'),
      requestResetPassword = document.getElementById('request-reset-password'),
      verifyOtpResetPassword = document.getElementById('verify-otp-reset-password');

// Toggle to Sign Up Form
signUp.addEventListener('click', () => {
    loginIn.classList.remove('block');
    loginUp.classList.remove('none');
    loginIn.classList.toggle('none');
    loginUp.classList.toggle('block');
});

// Toggle to Sign In Form
signIn.addEventListener('click', () => {
    loginIn.classList.remove('none');
    loginUp.classList.remove('block');
    loginIn.classList.toggle('block');
    loginUp.classList.toggle('none');
});

// Show Request Reset Password Form
resetPass.addEventListener('click', () => {
    loginIn.classList.remove('block');
    requestResetPassword.classList.remove('none');
    loginIn.classList.toggle('none');
    requestResetPassword.classList.toggle('block');
});

// Back to Sign In from Request Reset Password
backToLogin.addEventListener('click', () => {
    requestResetPassword.classList.remove('block');
    loginIn.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    loginIn.classList.toggle('block');
});

// Back to Request Reset Password from Verify OTP
backToRequestReset.addEventListener('click', () => {
    verifyOtpResetPassword.classList.remove('block');
    requestResetPassword.classList.remove('none');
    verifyOtpResetPassword.classList.toggle('none');
    requestResetPassword.classList.toggle('block');
    
});

// Show Verify OTP Form
function showVerifyOTPForm() {
    requestResetPassword.classList.remove('block');
    verifyOtpResetPassword.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    verifyOtpResetPassword.classList.toggle('block');
}

const API_URL = "https://script.google.com/macros/s/AKfycbzq26e3QS4XQqFgqjJjIm7qU6k0YymCv0IXgCo5rmpErhOQs0MCCGq7Fib3qoubGYM9lA/exec";

// Check if the user is already logged in by checking localStorage
window.onload = function() {
  const storedEmail = localStorage.getItem('email');
  const storedUsername = localStorage.getItem('username');
  if (storedEmail && storedUsername) {
    // Redirect to main page if email is found in localStorage
    window.location.href = "t2.html"; // Change to your main page URL
  }
    const passwordResetMessage = localStorage.getItem("passwordResetMessage");
  
  if (passwordResetMessage) {
    // Display the message (you can use a div or modal to show it)
    showPopupMessage(passwordResetMessage);  // Simple alert for demonstration
    
    // Remove the message from localStorage after displaying
    localStorage.removeItem("passwordResetMessage");
  }
};

async function register() {
    const username = document.getElementById("r_username").value.trim();
    const email = document.getElementById("r_email").value.trim();
    const password = document.getElementById("r_password").value;
    const tooltip = document.getElementById("tooltip-message");

    // Function to show tooltip message
    const showTooltipMessage = (message) => {
        tooltip.textContent = message;
        tooltip.style.display = "block";
    };

    // Function to hide tooltip message
    const hideTooltipMessage = () => {
        tooltip.style.display = "none";
    };

    // Input validation
    if (!/^[a-zA-Z0-9]{3,}$/.test(username)) {
        showTooltipMessage("Username must be at least 3 characters long and contain only letters and numbers.");
        return;
    }

    if (!/^[^\s@]+@gmail\.com$/.test(email)) {
        showTooltipMessage("Please enter a valid Gmail address (must end with @gmail.com).");
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        showTooltipMessage(
            "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
    }

    hideTooltipMessage(); // Hide the message if validation passes
    showLoading();

    const data = {
        action: "register",
        username: username,
        email: email,
        password: password,
    };

    try {
        const res = await fetch(API_URL, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(data) 
        });

        const result = await res.text();
        showTooltipMessage(result); // Show server response as tooltip
        if (res.ok) log_in(); // Only call log_in() if registration is successful
    } catch (error) {
        showTooltipMessage("An error occurred during registration. Please try again.");
    }

    hideLoading();
}


    async function login() {
      const data = {
        action: "login",
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      };
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
          localStorage.setItem("email", data.email);
        alert("Login successful");
        fetchUserDetails(email);
          window.location.href = "t2.html";
      } else {
        alert("Invalid credentials");
      }
    }

 function showPopupMessage(message) {
    popupMsg.textContent = message;
    popupMsg.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        popupMsg.classList.remove('show');
    }, 3000);
    }

    function showLoading() {
                loading.style.display = "flex";
            }

function hideLoading() {
                loading.style.display = "none";
            }

// Request OTP
async function requestPasswordReset() {
  const email = document.getElementById("resetEmail").value;

  const data = {
    action: "requestPasswordReset",
    email: email,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showPopupMessage(result.message);
      document.getElementById("request-reset-password").style.display = "none";
      document.getElementById("verify-otp-reset-password").style.display = "block";
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Verify OTP & Reset Password
async function verifyOTPAndResetPassword() {
  const email = document.getElementById("resetEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  const data = {
    action: "resetPasswordWithOTP",
    email: email,
    otp: otp,
    newPassword: newPassword,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showPopupMessage(result.message);
        document.getElementById("verify-otp-reset-password").style.display = "none";
        
      // Store success message in localStorage for displaying on login page
      localStorage.setItem("passwordResetMessage", "Password changed successfully! Please login.");
      
      // Redirect to login page
      window.location.href = "t1.html";
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Event Listeners
document.getElementById("request-reset-password").addEventListener("submit", (e) => {
  e.preventDefault();
  requestPasswordReset();
});

document.getElementById("verify-otp-reset-password").addEventListener("submit", (e) => {
  e.preventDefault();
  verifyOTPAndResetPassword();
});

//-----------
// Function to fetch user details by email
function fetchUserDetails(email) {
  const requestData = {
    action: 'fetchUserDetails',
    email: email
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const user = data.user;
      // Store username, email, and role in localStorage
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', user.role);
      console.log('User details fetched and stored in localStorage:', user);
        window.location.href = "t2.html";
    } else {
      console.error('Error fetching user details:', data.message);
        showPopupMessage("Failed to featch");
    }
  })
  .catch(error => {
    console.error('Error in fetchUserDetails:', error);
      showPopupMessage("Error to featch");
  });
}

// Function to modify user details (username, password, role, profile path)
function modifyUserDetails(email, newDetails) {
  const requestData = {
    action: 'modifyUserDetails',
    email: email,
    ...newDetails // Spread the new details like username, password, role, etc.
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('User details updated successfully');
    } else {
      console.error('Error modifying user details:', data.message);
    }
  })
  .catch(error => {
    console.error('Error in modifyUserDetails:', error);
  });
}

