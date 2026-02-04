import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';


const mockQuery = jest.fn();
const mockHash = jest.fn();
const mockCompare = jest.fn();
const mockSign = jest.fn();


jest.unstable_mockModule('../config/db.js', () => ({
    default: {
        query: mockQuery
    }
}));


jest.unstable_mockModule('bcrypt', () => ({
    default: {
        hash: mockHash,
        compare: mockCompare
    }
}));


jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: mockSign
    }
}));


const { inscription, connexion } = await import('../controllers/auth.js');

describe('Auth Controller Tests', () => {
    let req, res;

    beforeEach(() => {

        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
            cookie: jest.fn()
        };

        
        mockQuery.mockClear();
        mockHash.mockClear();
        mockCompare.mockClear();
        mockSign.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ========================================
    // TESTS POUR LA FONCTION INSCRIPTION
    // ========================================
    describe('inscription', () => {
        
        it('devrait retourner une erreur 400 si des champs sont manquants', () => {
            
            req.body = {
                prenom: 'Jean',
                nom: 'Dupont',
                email: 'jean@test.com'
                // telephone, dateDeNaissance et motDePasse manquants
            };

            
            inscription(req, res);

            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Champs manquants !');
        });

        it('devrait retourner une erreur 400 si le mot de passe est trop court', () => {
        
            req.body = {
                prenom: 'Jean',
                nom: 'Dupont',
                email: 'jean@test.com',
                dateDeNaissance: '1990-01-01',
                telephone: '0612345678',
                motDePasse: 'court123' // Moins de 12 caractères
            };

            
            inscription(req, res);

            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Mot de passe trop court !');
        });

        it('devrait retourner une erreur 400 si l\'email existe déjà', () => {
            
            req.body = {
                prenom: 'Jean',
                nom: 'Dupont',
                email: 'jean@test.com',
                dateDeNaissance: '1990-01-01',
                telephone: '0612345678',
                motDePasse: 'motdepassesecurise123'
            };

            // Mock de la requête DB qui retourne un utilisateur existant
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(null, [{ id_adherent: 1, email: 'jean@test.com' }]);
            });

    
            inscription(req, res);

            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Il existe déjà un adherent possédant le même email !');
        });

        it('devrait créer un nouvel utilisateur avec succès et retourner un token', (done) => {
            
            req.body = {
                prenom: 'Jean',
                nom: 'Dupont',
                email: 'jean@test.com',
                dateDeNaissance: '1990-01-01',
                telephone: '0612345678',
                motDePasse: 'motdepassesecurise123'
            };

            const hashedPassword = '$2b$10$hashedPasswordExample';
            const userId = 42;
            const token = 'jwt.token.example';

            
            mockHash.mockImplementation((password, rounds, callback) => {
                callback(null, hashedPassword);
            });

            
            mockSign.mockReturnValue(token);

            // Mock de la requête DB
            let queryCount = 0;
            mockQuery.mockImplementation((sql, params, callback) => {
                queryCount++;
                
            
                if (queryCount === 1) {
                    callback(null, []);
                } 
                
                else if (queryCount === 2) {
                    callback(null, { insertId: userId });
                }
            });

        
            inscription(req, res);

            setTimeout(() => {
                expect(mockHash).toHaveBeenCalledWith('motdepassesecurise123', 10, expect.any(Function));
                expect(mockSign).toHaveBeenCalledWith(
                    { id: userId, role: 'utilisateur' },
                    process.env.secretKey,
                    { expiresIn: '24h' }
                );
                expect(res.cookie).toHaveBeenCalledWith('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000
                });
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Adherent ajouté avec succès !',
                    id: userId,
                    role: 'utilisateur'
                });
                done();
            }, 100);
        });

        it('devrait retourner une erreur 500 en cas d\'erreur de base de données', () => {
      
            req.body = {
                prenom: 'Jean',
                nom: 'Dupont',
                email: 'jean@test.com',
                dateDeNaissance: '1990-01-01',
                telephone: '0612345678',
                motDePasse: 'motdepassesecurise123'
            };

            // Mock d'une erreur DB
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(new Error('Erreur de connexion à la base de données'), null);
            });

      
            inscription(req, res);

 
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de las vérification des infos');
        });
    });

    // ========================================
    // TESTS POUR LA FONCTION CONNEXION
    // ========================================
    describe('connexion', () => {

        it('devrait retourner une erreur 400 si des champs sont manquants', () => {
           
            req.body = {
                email: 'jean@test.com'
                // motDePasse manquant
            };

            
            connexion(req, res);

     
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Champs manquants !');
        });

        it('devrait retourner une erreur 400 si le mot de passe est trop court', () => {
        
            req.body = {
                email: 'jean@test.com',
                motDePasse: 'court'
            };

    
            connexion(req, res);

       
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Mot de passe trop court !');
        });

        it('devrait retourner une erreur 404 si l\'email n\'existe pas', () => {
           
            req.body = {
                email: 'inexistant@test.com',
                motDePasse: 'motdepassesecurise123'
            };

            // Mock DB sans résultat
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(null, []);
            });

   
            connexion(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('L\'email n\'existe pas !');
        });

        it('devrait retourner une erreur 401 si le mot de passe est incorrect', (done) => {
      
            req.body = {
                email: 'jean@test.com',
                motDePasse: 'mauvaisMotDePasse123'
            };

            const userFromDB = {
                id_adherent: 1,
                email: 'jean@test.com',
                role: 'utilisateur',
                mot_de_passe: '$2b$10$hashedPasswordExample'
            };

            // Mock DB retourne un utilisateur
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(null, [userFromDB]);
            });

            // Mock bcrypt.compare retourne false
            mockCompare.mockImplementation((password, hash, callback) => {
                callback(null, false);
            });

          
            connexion(req, res);

            setTimeout(() => {
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith('Mot de passe incorrect !');
                done();
            }, 100);
        });

        it('devrait connecter l\'utilisateur avec succès et retourner un token', (done) => {
          
            req.body = {
                email: 'jean@test.com',
                motDePasse: 'motdepassecorrect123'
            };

            const userFromDB = {
                id_adherent: 1,
                email: 'jean@test.com',
                role: 'utilisateur',
                mot_de_passe: '$2b$10$hashedPasswordExample'
            };

            const token = 'jwt.token.example';

            // Mock DB retourne un utilisateur
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(null, [userFromDB]);
            });

            // Mock bcrypt.compare retourne true
            mockCompare.mockImplementation((password, hash, callback) => {
                callback(null, true);
            });

            // Mock jwt.sign
            mockSign.mockReturnValue(token);

            
            connexion(req, res);

           
            setTimeout(() => {
                expect(mockCompare).toHaveBeenCalledWith(
                    'motdepassecorrect123',
                    userFromDB.mot_de_passe,
                    expect.any(Function)
                );
                expect(mockSign).toHaveBeenCalledWith(
                    { id: userFromDB.id_adherent, role: userFromDB.role },
                    process.env.secretKey,
                    { expiresIn: '24h' }
                );
                expect(res.cookie).toHaveBeenCalledWith('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000
                });
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Vous êtes connecté !',
                    role: userFromDB.role,
                    id: userFromDB.id_adherent
                });
                done();
            }, 100);
        });

        it('devrait retourner une erreur 500 en cas d\'erreur de base de données', () => {
          
            req.body = {
                email: 'jean@test.com',
                motDePasse: 'motdepassesecurise123'
            };

            // Mock d'une erreur DB
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(new Error('Erreur DB'), null);
            });

            connexion(req, res);

     
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la recherche de l\'adherent !');
        });

        it('devrait retourner une erreur 500 en cas d\'erreur lors de la comparaison de mot de passe', (done) => {
         
            req.body = {
                email: 'jean@test.com',
                motDePasse: 'motdepassesecurise123'
            };

            const userFromDB = {
                id_adherent: 1,
                email: 'jean@test.com',
                role: 'utilisateur',
                mot_de_passe: '$2b$10$hashedPasswordExample'
            };

            // Mock DB retourne un utilisateur
            mockQuery.mockImplementation((sql, params, callback) => {
                callback(null, [userFromDB]);
            });

            // Mock bcrypt.compare retourne une erreur
            mockCompare.mockImplementation((password, hash, callback) => {
                callback(new Error('Erreur bcrypt'), null);
            });


            connexion(req, res);

          
            setTimeout(() => {
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.send).toHaveBeenCalledWith('Erreur lors de la vérification du mot de passe !');
                done();
            }, 100);
        });
    });
});