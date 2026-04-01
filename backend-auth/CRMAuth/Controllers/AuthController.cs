using CRMAuth.DTOs;
using CRMAuth.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMAuth.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "User registered successfully",
                Data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Registration failed");
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during registration");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "An error occurred during registration"
            });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Login successful",
                Data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Login failed");
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during login");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "An error occurred during login"
            });
        }
    }

    [HttpGet("verify")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> Verify()
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email))
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid token"
            });
        }

        var user = await _authService.GetUserByEmailAsync(email);
        if (user == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "User not found"
            });
        }

        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Message = "Token is valid",
            Data = user
        });
    }
}
