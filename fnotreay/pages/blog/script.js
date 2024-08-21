document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Gather form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Simple validation (add more complex checks as needed)
    if (firstName && lastName && dob && gender && email && phone && address) {
        alert('Registration successful!\n\n' +
              `Name: ${firstName} ${lastName}\n` +
              `DOB: ${dob}\n` +
              `Gender: ${gender}\n` +
              `Email: ${email}\n` +
              `Phone: ${phone}\n` +
              `Address: ${address}`);
    } else {
        alert('Please fill in all fields.');
    }
});
