const form = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const dobInput = document.getElementById('dob');
const termsInput = document.getElementById('terms');
const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

// Load saved data from web storage, if available
let savedData = JSON.parse(localStorage.getItem('registrationData'));
if (savedData) {
  savedData.forEach((data) => {
    const newRow = userTable.insertRow();
    const nameCell = newRow.insertCell(0);
    const emailCell = newRow.insertCell(1);
    const passwordCell = newRow.insertCell(2);
    const dobCell = newRow.insertCell(3);
    const termsCell = newRow.insertCell(4);
    nameCell.innerHTML = data.name;
    emailCell.innerHTML = data.email;
    passwordCell.innerHTML = data.password;
    dobCell.innerHTML = data.dob;
    termsCell.innerHTML = data.termsAccepted ? 'true' : 'false';
  });
} else {
  savedData = [];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get user's date of birth and calculate age
  const dob = new Date(dobInput.value);
  const ageInMilliseconds = Date.now() - dob.getTime();
  const ageInYears = ageInMilliseconds / 1000 / 60 / 60 / 24 / 365;

  // Check if user is between 18 and 55 years old
  if (ageInYears < 18 || ageInYears > 55) {
    alert('You must be between 18 and 55 years old to register.');
    return;
  }

  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    dob: dobInput.value,
    termsAccepted: termsInput.checked,
  };

  // Save form data to web storage
  savedData.push(formData);
  localStorage.setItem('registrationData', JSON.stringify(savedData));

  // Append form data to user table
  const newRow = userTable.insertRow();
  const nameCell = newRow.insertCell(0);
  const emailCell = newRow.insertCell(1);
  const passwordCell = newRow.insertCell(2);
  const dobCell = newRow.insertCell(3);
  const termsCell = newRow.insertCell(4);
  nameCell.innerHTML = formData.name;
  emailCell.innerHTML = formData.email;
  passwordCell.innerHTML = formData.password;
  dobCell.innerHTML = formData.dob;
  termsCell.innerHTML = formData.termsAccepted ? 'true' : 'false';

  // Reset form
  form.reset();
});
