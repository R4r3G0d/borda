package main

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	app := fiber.New()
	app.Static("/", "./public")

	db, err := sqlx.Connect("sqlite3", "db.sqlite3")
	if err != nil {
		panic(err)
	}
	// schema :=`
	// CREATE TABLE IF NOT EXISTS brawlers (
	// 	id INTEGER PRIMARY KEY,
	// 	name text UNIQUE,
	// 	rarity text NULL
	// );
	// CREATE TABLE IF NOT EXISTS the_flag_is_in_here_730387f4b640c398a3d769a39f9cf9b5(
	// 	flag text
	// );
	// INSERT INTO the_flag_is_in_here_730387f4b640c398a3d769a39f9cf9b5 (flag) VALUES
	// 	('MakaraCTF{br4wl3r_4nd_sql1t3_m4st3r}');
	// INSERT INTO brawlers (name, rarity) VALUES
	// 	('Shelly', 'rare'), ('Spike', 'common');`

	// if _, err := db.Exec(schema); err != nil {
	// 	panic(err)
	// }

	app.Get("/search", func(c *fiber.Ctx) error {
		// body := string(c.Body())

		// tables := `%' UNION SELECT name, null FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';--`
		// flag := "%' and 0 UNION SELECT flag, null FROM the_flag_is_in_here_730387f4b640c398a3d769a39f9cf9b5;--"

		// body += tables
		// query := `SELECT name, rarity FROM brawlers WHERE name LIKE '%` + body + `%'`

		// This works
		// SELECT name, rarity FROM brawlers WHERE name LIKE '%%' UNION SELECT name, null FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';--%';
		
		query := "SELECT name, rarity FROM brawlers WHERE name LIKE '%%' UNION SELECT name, 'null' FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'"
		fmt.Println(query)

		type result struct {
			Name   string
			Rarity string
		}
		var results []result
		// results := make([]string, 0)

		time.Sleep(time.Millisecond*5000)

		rows, err := db.Queryx(query)
		if err != nil {
			panic(err)
		}
		for rows.Next() {
			var r result
			if err := rows.StructScan(&r); err != nil {
				panic(err)
			}

			results = append(results, r)
		}

		// if err = db.Select(&results, query); err != nil {
		// 	panic(err)
		// 	// return c.JSON(fiber.Map{
		// 	// 	"success": false,
		// 	// 	"message": "Something went wrong :(",
		// 	// 	"results": err.Error(),
		// 	// })
		// }

		return c.JSON(fiber.Map{
			"success": true,
			"message": fmt.Sprintf("%d result(s)", len(results)),
			"results": results,
		})
	})

	app.Listen(":3000")
}
