import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockQuery = jest.fn();

jest.unstable_mockModule('../config/db.js', () => ({
    default: { query: mockQuery }
}));

const { mettreScore } = await import('../controllers/statistiqueAdherent.js');

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Saisie du score par un adherent', () => {
    beforeEach(() => {
        mockQuery.mockReset();
    });

    it('refuse un score negatif', () => {
        const req = {
            user: { id: 25 },
            body: { id_match: 10, mon_score: -1, score_adversaire: 2 }
        };
        const res = createResponse();

        mettreScore(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('refuse un adherent qui ne participe pas au match', () => {
        mockQuery.mockImplementationOnce((sql, params, callback) => {
            callback(null, []);
        });

        const req = {
            user: { id: 27 },
            body: { id_match: 10, mon_score: 3, score_adversaire: 1 }
        };
        const res = createResponse();

        mettreScore(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("enregistre le score dans l'ordre du match pour l'adherent 1", () => {
        mockQuery
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{
                    id_match: 10,
                    id_adherent_1: 25,
                    id_adherent_2: 28,
                    date_match: '2020-06-20'
                }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                expect(params).toEqual([10, 3, 1]);
                callback(null, { affectedRows: 1 });
            })
            .mockImplementationOnce((sql, params, callback) => {
                expect(params).toEqual([25, 28]);
                callback(null, { affectedRows: 2 });
            });

        const req = {
            user: { id: 25 },
            body: { id_match: 10, mon_score: 3, score_adversaire: 1 }
        };
        const res = createResponse();

        mettreScore(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Score enregistre avec succes.',
            id_match: 10,
            nb_but_adherent_1: 3,
            nb_but_adherent_2: 1
        });
    });

    it("inverse les valeurs quand l'utilisateur est l'adherent 2", () => {
        mockQuery
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, [{
                    id_match: 10,
                    id_adherent_1: 25,
                    id_adherent_2: 28,
                    date_match: new Date('2020-06-20T00:00:00')
                }]);
            })
            .mockImplementationOnce((sql, params, callback) => {
                expect(params).toEqual([10, 4, 2]);
                callback(null, { affectedRows: 1 });
            })
            .mockImplementationOnce((sql, params, callback) => {
                expect(params).toEqual([25, 28]);
                callback(null, { affectedRows: 2 });
            });

        const req = {
            user: { id: 28 },
            body: { id_match: 10, mon_score: 2, score_adversaire: 4 }
        };
        const res = createResponse();

        mettreScore(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Score enregistre avec succes.',
            id_match: 10,
            nb_but_adherent_1: 4,
            nb_but_adherent_2: 2
        });
    });
});
