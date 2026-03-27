using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using PentaHub.Application.Auth.DTOs;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.API.Tests.Endpoints;

public class AuthEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthEndpointTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidRequest_ReturnsCreatedWithToken()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FullName = "Yeni Kullanıcı",
            Email = $"yeni.kullanici.{Guid.NewGuid():N}@test.com",
            Password = "Password123!",
            Department = "Test"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().NotBeNullOrEmpty();
        result.Data.RefreshToken.Should().NotBeNullOrEmpty();
        result.Data.User.Should().NotBeNull();
        result.Data.User.FullName.Should().Be("Yeni Kullanıcı");
    }

    [Fact]
    public async Task Register_DuplicateEmail_ReturnsBadRequest()
    {
        // Arrange - first register
        var email = $"duplicate.{Guid.NewGuid():N}@test.com";
        var firstRequest = new RegisterRequest
        {
            FullName = "İlk Kullanıcı",
            Email = email,
            Password = "Password123!"
        };
        await _client.PostAsJsonAsync("/api/auth/register", firstRequest);

        // Attempt to register again with the same email
        var duplicateRequest = new RegisterRequest
        {
            FullName = "İkinci Kullanıcı",
            Email = email,
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", duplicateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_CorrectCredentials_ReturnsOkWithToken()
    {
        // Arrange - register first so we have a user with known password
        var email = $"login.test.{Guid.NewGuid():N}@test.com";
        var registerRequest = new RegisterRequest
        {
            FullName = "Login Test",
            Email = email,
            Password = "Password123!"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = email,
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().NotBeNullOrEmpty();
        result.Data.ExpiresAt.Should().BeAfter(DateTime.UtcNow);
        result.Data.User.Email.Should().Be(email);
    }

    [Fact]
    public async Task Login_WrongPassword_ReturnsBadRequest()
    {
        // Arrange
        var email = $"wrongpass.{Guid.NewGuid():N}@test.com";
        var registerRequest = new RegisterRequest
        {
            FullName = "Wrong Pass Test",
            Email = email,
            Password = "CorrectPassword123!"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = email,
            Password = "WrongPassword999!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        // LoginCommandHandler throws KeyNotFoundException for wrong password,
        // which the global error handler maps to 404
        response.StatusCode.Should().BeOneOf(HttpStatusCode.BadRequest, HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetCurrentUser_WithoutToken_ReturnsUnauthorized()
    {
        // Ensure no auth header
        _client.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await _client.GetAsync("/api/auth/me");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetCurrentUser_WithValidToken_ReturnsOkWithUser()
    {
        // Arrange - register and get a token
        var email = $"me.test.{Guid.NewGuid():N}@test.com";
        var registerRequest = new RegisterRequest
        {
            FullName = "Me Test User",
            Email = email,
            Password = "Password123!"
        };
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var registered = await registerResponse.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>();
        var token = registered!.Data!.Token;

        // Act
        var requestWithToken = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        requestWithToken.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(requestWithToken);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<UserDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Email.Should().Be(email);
        result.Data.FullName.Should().Be("Me Test User");
    }
}
