#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 9999
EXPOSE 9998

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["GrpcNotifications.csproj", "."]
RUN dotnet restore "./GrpcNotifications.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "GrpcNotifications.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GrpcNotifications.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GrpcNotifications.dll"]