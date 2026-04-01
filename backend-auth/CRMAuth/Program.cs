using CRMAuth.Data;
using CRMAuth.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseSqlServer(connectionString));

// JWT Configuration
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "your-secret-key-min-32-chars-long!";
var key = System.Text.Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "CRMSystem",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "CRMSystemUsers",
        ValidateLifetime = true
    };
});

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CRM Auth API",
        Version = "v1",
        Description = "Authentication service for Eduardo Faustos System"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter into field the word 'Bearer' following by space and JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CRM Auth API V1");
});

if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication();
app.UseAuthorization();

// Root endpoint - redirect to swagger UI
app.MapGet("/", () => Results.Redirect("/swagger/index.html", permanent: true));

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "Auth API", timestamp = DateTime.UtcNow }));

app.MapControllers();

// Initial migration with retry logic
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    var retryCount = 0;
    const int maxRetries = 15;  // Increased to 15 retries
    const int delayMs = 2000;   // 2 seconds between retries

    while (retryCount < maxRetries)
    {
        try
        {
            System.Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss}] Attempting database migration (attempt {retryCount + 1}/{maxRetries})...");
            dbContext.Database.Migrate();
            System.Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss}] ✓ Database migration completed successfully!");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            if (retryCount >= maxRetries)
            {
                System.Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss}] ✗ Database migration failed after {maxRetries} attempts!");
                System.Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
            System.Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss}] Migration attempt failed: {ex.Message.Substring(0, Math.Min(100, ex.Message.Length))}...");
            System.Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss}] Retrying in {delayMs}ms... ({retryCount}/{maxRetries})");
            System.Threading.Thread.Sleep(delayMs);
        }
    }
}

app.Run();
