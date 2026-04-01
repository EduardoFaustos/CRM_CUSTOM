// Frontend Service Tests
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '@core/services/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user', (done) => {
    const mockRequest = { email: 'test@example.com', password: 'password123', name: 'Test User' };
    const mockResponse = {
      token: 'test_token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    service.register(mockRequest).subscribe({
      next: (response) => {
        expect(response.token).toBe('test_token');
        expect(response.user.email).toBe('test@example.com');
        done();
      }
    });

    const req = httpMock.expectOne(request => request.url.includes('/auth/register'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login user', (done) => {
    const mockRequest = { email: 'test@example.com', password: 'password123' };
    const mockResponse = {
      token: 'test_token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    service.login(mockRequest).subscribe({
      next: () => {
        expect(localStorage.getItem('token')).toBe('test_token');
        done();
      }
    });

    const req = httpMock.expectOne(request => request.url.includes('/auth/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout user', () => {
    localStorage.setItem('token', 'test_token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
