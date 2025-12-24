import bcrypt from 'bcrypt';

const password = "SuperAdmin123456";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erreur lors du hachage:', err);
        process.exit(1);
    }
    
    console.log('='.repeat(60));
    console.log('Hash bcrypt généré pour le mot de passe:', password);
    console.log('='.repeat(60));
    console.log(hash);
    console.log('='.repeat(60));
    console.log('\nCopier-coller ce hash dans le fichier SQL d\'insertion');
    console.log('='.repeat(60));
    
    process.exit(0);
});
