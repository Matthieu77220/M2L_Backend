const defaultFields = ["honeypot", "website", "company", "url"]

const hasFilledHoneypot = (body, fields) => {
    if (!body || typeof body !== "object") {
        return false
    }

    return fields.some((field) => {
        const value = body[field]

        if (value === undefined || value === null) {
            return false
        }

        if (typeof value === "string") {
            return value.trim() !== ""
        }

        return true
    })
}

const honeypot = (fields = defaultFields) => {
    return (req, res, next) => {
        if (hasFilledHoneypot(req.body, fields)) {
            return res.status(400).json({ message: "Requête suspecte" })
        }

        next()
    }
}

export { defaultFields, hasFilledHoneypot }
export default honeypot
