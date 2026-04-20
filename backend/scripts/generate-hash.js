const bcrypt = require('bcryptjs');
const pwd = process.argv[2] || 'password123';
bcrypt.hash(pwd, 12).then(h => {
  console.log(`\nMot de passe : ${pwd}`);
  console.log(`Hash bcrypt  : ${h}\n`);
  process.exit(0);
});
