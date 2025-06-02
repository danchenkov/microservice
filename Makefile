USER_CONTAINER := $(shell docker ps --filter "name=user" --format "{{.Names}}")

test-user:
	docker exec -it $(USER_CONTAINER) node testClient.js
