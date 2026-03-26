# AI Usage Notes

I built this project myself and used AI only as a helper for drafts and cleanup. Final code and decisions were reviewed and adjusted manually.

## How I used AI

- Helped with boilerplate and basic test structure.
- Gave suggestions for refactoring and naming.
- I kept only the parts that matched the project requirements.

## Human decisions

- Kept business logic in services, not controllers.
- Used Mongo conditional updates for stock safety.
- Updated tests manually for real edge cases.

## Run without Docker

Docker is optional. The app also runs normally if these services are available:

- MongoDB on `localhost:27017`
- Redis on `localhost:6379`
- RabbitMQ on `localhost:5672`

Then run:

- API: `dotnet run --project src/InventoryHold.WebApi/InventoryHold.WebApi.csproj`
- UI: `cd frontend && npm install && npm run dev`
