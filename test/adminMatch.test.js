import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockQuery = jest.fn();

jest.unstable_mockModule('../config/db.js', () => ({
    default: { query: mockQuery }
}));

const { createMatch, getMatchAdherents } = await import('../controllers/admin.js');

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Gestion admin des matchs', () => {
    beforeEach(() => {
        mockQuery.mockReset();
    });

    it('refuse deux adherents identiques', () => {
        const req = {
            user: { id: 15, role: 'admin' },
            body: {
                id_adherent_1: 25,
                id_adherent_2: 25,
                date_match: '2026-06-20'
            }
        };
        const res = createResponse();

        createMatch(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it("refuse un adherent qui n'appartient pas au club de l'admin", () => {
        mockQuery
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{ id_club: 1, role: 'admin' }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [
                    { id_adherent: 25, id_club: 1, role: 'utilisateur' },
                    { id_adherent: 26, id_club: 2, role: 'utilisateur' }
                ]);
            });

        const req = {
            user: { id: 15, role: 'admin' },
            body: {
                id_adherent_1: 25,
                id_adherent_2: 26,
                date_match: '2026-06-20'
            }
        };
        const res = createResponse();

        createMatch(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('cree un match entre deux adherents du club', () => {
        mockQuery
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{ id_club: 1, role: 'admin' }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [
                    { id_adherent: 25, id_club: 1, role: 'utilisateur' },
                    { id_adherent: 26, id_club: 1, role: 'utilisateur' }
                ]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, []);
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { insertId: 42 });
            });

        const req = {
            user: { id: 15, role: 'admin' },
            body: {
                id_adherent_1: 25,
                id_adherent_2: 26,
                date_match: '2026-06-20'
            }
        };
        const res = createResponse();

        createMatch(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Match cree avec succes',
            id_match: 42
        });
    });

    it("ne liste que les adherents du club de l'admin", () => {
        const adherents = [
            { id_adherent: 25, id_club: 1, prenom: 'Camille', nom: 'Renaud' }
        ];

        mockQuery
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{ id_club: 1, role: 'admin' }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                expect(params).toEqual([1]);
                callback(null, adherents);
            });

        const req = { user: { id: 15, role: 'admin' } };
        const res = createResponse();

        getMatchAdherents(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(adherents);
    });
});
