import bcrypt from 'bcrypt';

const password = 'SuperAdmin123456!';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Hash bcrypt pour "SuperAdmin123456":');
        console.log(hash);
    }
});
