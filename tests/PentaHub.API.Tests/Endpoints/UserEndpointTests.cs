using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.API.Tests.Endpoints;

public class UserEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public UserEndpointTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUsers_ReturnsOkWithUserList()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<UserDto>>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Should().HaveCountGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task GetUsers_ReturnsOnlyActiveUsers()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<UserDto>>>();
        result.Should().NotBeNull();
        result!.Data.Should().NotBeNull();

        // Our test-seeded users (ID 101, 102) should be present
        result.Data!.Should().Contain(u => u.Email == "manager@test.com");
        result.Data.Should().Contain(u => u.Email == "user@test.com");
    }

    [Fact]
    public async Task GetUsers_ReturnsUsersWithRequiredFields()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<UserDto>>>();
        result.Should().NotBeNull();
        result!.Data.Should().NotBeNull();

        foreach (var user in result.Data!)
        {
            user.Id.Should().BeGreaterThan(0);
            user.FullName.Should().NotBeNullOrEmpty();
            user.Email.Should().NotBeNullOrEmpty();
            user.Role.Should().NotBeNullOrEmpty();
        }
    }
}
