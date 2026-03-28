FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/PentaHub.API/PentaHub.API.csproj", "PentaHub.API/"]
COPY ["src/PentaHub.Application/PentaHub.Application.csproj", "PentaHub.Application/"]
COPY ["src/PentaHub.Domain/PentaHub.Domain.csproj", "PentaHub.Domain/"]
COPY ["src/PentaHub.Infrastructure/PentaHub.Infrastructure.csproj", "PentaHub.Infrastructure/"]
RUN dotnet restore "PentaHub.API/PentaHub.API.csproj"

COPY src/ .
WORKDIR "/src/PentaHub.API"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "PentaHub.API.dll"]
