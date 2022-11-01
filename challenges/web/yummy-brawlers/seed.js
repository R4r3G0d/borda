const sqlite = require('better-sqlite3');

const db = sqlite('db.sqlite3');

const query = `CREATE TABLE IF NOT EXISTS brawlers(
    id INTEGER,
    name TEXT,
    color TEXT
);
CREATE TABLE IF NOT EXISTS the_flag_is_in_here_1d4c9282775ae0d4d53ad0967693b44d(flag TEXT);`;
let results;
try {
    results = db.prepare(query).all();
} catch {
    return res.json({
        success: false,
        msg: 'Something went wrong :(',
        results: [],
    })
}
