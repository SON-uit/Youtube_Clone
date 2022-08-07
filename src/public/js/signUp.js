//DISPLAY FORM FOR USER
// ALERT ///
const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 3000);
};

$("#signUpForm button[type=submit]").click(async (e) => {
  e.preventDefault();
  const firstName = $("#firstName").val();
  const lastName = $("#lastName").val();
  const email = $("#email").val();
  const password = $("#password").val();
  try {
    const response = await axios({
      method: "POST",
      url: "/api/users/signUp",
      data: {
        firstName,
        lastName,
        password,
        email,
      },
    });
    if (response.data.status === "Success") {
      showAlert("success", "Sign Up Successfully,Check Your Mail");
      window.setTimeout(() => {
        location.assign("/sign-in");
      }, 1000);
    }
  } catch (err) {
    showAlert("failed", err.response.data.message);
  }
});
