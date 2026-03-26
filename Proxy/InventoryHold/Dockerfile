# One image: ASP.NET hosts API + Vite static UI on port 8080 (map e.g. 5080:8080 in Compose).
# DOCKER_PLATFORM: linux/amd64 default (typical Docker Desktop VM); use linux/arm64 for native arm64 engine.
ARG DOCKER_PLATFORM=linux/amd64

FROM --platform=${DOCKER_PLATFORM} node:20-alpine AS frontend-build
WORKDIR /web
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM --platform=${DOCKER_PLATFORM} mcr.microsoft.com/dotnet/sdk:10.0 AS app-build
WORKDIR /src
COPY InventoryHold.sln ./
COPY src/ ./src/
COPY --from=frontend-build /web/dist ./src/InventoryHold.WebApi/wwwroot/
RUN dotnet restore src/InventoryHold.WebApi/InventoryHold.WebApi.csproj
RUN dotnet publish src/InventoryHold.WebApi/InventoryHold.WebApi.csproj -c Release -o /app/publish --no-restore

FROM --platform=${DOCKER_PLATFORM} mcr.microsoft.com/dotnet/aspnet:10.0 AS app
WORKDIR /app
COPY --from=app-build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "InventoryHold.WebApi.dll"]
