import { describe, it, expect, jest, beforeEach } from "@jest/globals"
import honeypot, { hasFilledHoneypot } from "../middleware/honeypot.js"

describe("Honeypot Middleware Tests", () => {
    let req, res, next

    beforeEach(() => {
        req = {
            body: {}
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        next = jest.fn()
    })

    it("devrait laisser passer une requête sans champ honeypot rempli", () => {
        req.body = {
            email: "jean@test.com",
            motDePasse: "motdepassecorrect123",
            website: ""
        }

        honeypot()(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })

    it("devrait bloquer une requête avec un champ honeypot rempli", () => {
        req.body = {
            email: "bot@test.com",
            motDePasse: "motdepassecorrect123",
            website: "https://spam.test"
        }

        honeypot()(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "Requête suspecte" })
        expect(next).not.toHaveBeenCalled()
    })

    it("devrait permettre de configurer le nom du champ honeypot", () => {
        req.body = {
            email: "bot@test.com",
            hiddenField: "spam"
        }

        honeypot(["hiddenField"])(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(next).not.toHaveBeenCalled()
    })
})

describe("hasFilledHoneypot", () => {
    it("devrait ignorer les champs absents ou vides", () => {
        expect(hasFilledHoneypot({ website: "   " }, ["website"])).toBe(false)
        expect(hasFilledHoneypot({}, ["website"])).toBe(false)
        expect(hasFilledHoneypot(null, ["website"])).toBe(false)
    })

    it("devrait détecter une valeur non vide", () => {
        expect(hasFilledHoneypot({ website: "spam" }, ["website"])).toBe(true)
    })
})
