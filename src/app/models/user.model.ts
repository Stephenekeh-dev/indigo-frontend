export interface User {
  id:             string;
  full_name:      string;
  email:          string;
  role:           'user' | 'consultant' | 'admin';
  avatar_url:     string | null;
  email_verified: boolean;
  created_at:     string;
}

export interface AuthResponse {
  token:         string;
  refresh_token: string;
  user:          User;
}

export interface LoginDto {
  email:    string;
  password: string;
}

export interface RegisterDto {
  full_name: string;
  email:     string;
  password:  string;
}