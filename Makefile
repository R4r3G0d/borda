compose:
	docker-compose up -d

compose-build:
	docker-compose build

compose-logs:
	docker-compose logs -f

compose-down:
	docker-compose down --remove-orphans || true

compose-clear:
	docker-compose down -v --remove-orphans || true

compose-stop:
	docker-compose stop || true

compose-restart:
	docker-compose restart