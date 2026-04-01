using CRMAuth.Data;
using CRMAuth.DTOs;
using CRMAuth.Models;
using CRMAuth.Services;
using Moq;
using Xunit;

namespace CRMAuth.Tests;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<IPasswordService> _passwordServiceMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        _passwordServiceMock = new Mock<IPasswordService>();
        _authService = new AuthService(
            _userRepositoryMock.Object,
            _tokenServiceMock.Object,
            _passwordServiceMock.Object
        );
    }

    [Fact]
    public async Task RegisterAsync_WithValidRequest_ShouldCreateUser()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "test@example.com",
            Name = "Test User",
            Password = "password123"
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _passwordServiceMock
            .Setup(x => x.HashPassword(request.Password))
            .Returns("hashed_password");

        _tokenServiceMock
            .Setup(x => x.GenerateToken(It.IsAny<User>()))
            .Returns("test_token");

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test_token", result.Token);
        Assert.Equal(request.Email, result.User.Email);
        Assert.Equal(request.Name, result.User.Name);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ShouldThrowException()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "existing@example.com",
            Name = "Test User",
            Password = "password123"
        };

        var existingUser = new User { Id = Guid.NewGuid(), Email = request.Email };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync(existingUser);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _authService.RegisterAsync(request)
        );
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ShouldReturnAuthResponse()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Name = "Test User",
            PasswordHash = "hashed_password"
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync(user);

        _passwordServiceMock
            .Setup(x => x.VerifyPassword(request.Password, user.PasswordHash))
            .Returns(true);

        _tokenServiceMock
            .Setup(x => x.GenerateToken(user))
            .Returns("test_token");

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test_token", result.Token);
        Assert.Equal(user.Email, result.User.Email);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ShouldThrowException()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "wrong_password"
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = "hashed_password"
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(request.Email))
            .ReturnsAsync(user);

        _passwordServiceMock
            .Setup(x => x.VerifyPassword(request.Password, user.PasswordHash))
            .Returns(false);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _authService.LoginAsync(request)
        );
    }
}
