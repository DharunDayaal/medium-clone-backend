function parseJwtExpiry(expiry) {
    if (typeof expiry === "number") {
        return expiry * 1000; // seconds to ms
    }
    if (typeof expiry === "string" && expiry.endsWith("d")) {
        return parseInt(expiry) * 24 * 60 * 60 * 1000;
    }
    if (typeof expiry === "string" && expiry.endsWith("h")) {
        return parseInt(expiry) * 60 * 60 * 1000;
    }
    if (typeof expiry === "string" && expiry.endsWith("m")) {
        return parseInt(expiry) * 60 * 1000;
    }
    return 0;
}

export default parseJwtExpiry