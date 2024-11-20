const bcrypt = require('bcrypt');

(async () => {
    const password = "yourpassword"; // Replace with your actual password
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);
    } catch (err) {
        console.error("Error hashing password:", err);
    }
})();

