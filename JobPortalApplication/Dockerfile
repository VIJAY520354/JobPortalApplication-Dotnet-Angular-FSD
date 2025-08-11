# Use .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY JobPortalApplication/JobPortalApplication/JobPortalApplication.csproj JobPortalApplication/JobPortalApplication/
RUN dotnet restore JobPortalApplication/JobPortalApplication/JobPortalApplication.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish JobPortalApplication/JobPortalApplication/JobPortalApplication.csproj -c Release -o /app/publish

# Final image with runtime only
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "JobPortalApplication.dll"]
