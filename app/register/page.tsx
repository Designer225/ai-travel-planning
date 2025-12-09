'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Link as MuiLink,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/app/lib/themes";
import { register as registerUser } from "@/app/lib/sessionControl";
import Link from "next/link";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            component="section"
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            role="region"
            aria-labelledby="register-heading"
          >
            <Typography component="h1" variant="h4" gutterBottom id="register-heading">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign up to start planning your next adventure
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }} role="alert">
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: "100%" }}
              noValidate
              aria-label="Registration form"
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  {...register("firstName")}
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                  autoComplete="given-name"
                  required
                  inputProps={{
                    'aria-label': 'First name',
                    'aria-required': 'true',
                    'aria-invalid': !!errors.firstName,
                    'aria-describedby': errors.firstName ? 'firstName-error' : undefined,
                  }}
                  FormHelperTextProps={{
                    id: 'firstName-error',
                  }}
                />

                <TextField
                  {...register("lastName")}
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                  autoComplete="family-name"
                  required
                  inputProps={{
                    'aria-label': 'Last name',
                    'aria-required': 'true',
                    'aria-invalid': !!errors.lastName,
                    'aria-describedby': errors.lastName ? 'lastName-error' : undefined,
                  }}
                  FormHelperTextProps={{
                    id: 'lastName-error',
                  }}
                />
              </Box>

              <TextField
                {...register("email")}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isLoading}
                autoComplete="email"
                required
                inputProps={{
                  'aria-label': 'Email address',
                  'aria-required': 'true',
                  'aria-invalid': !!errors.email,
                  'aria-describedby': errors.email ? 'email-error' : undefined,
                }}
                FormHelperTextProps={{
                  id: 'email-error',
                }}
              />

              <TextField
                {...register("password")}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
                autoComplete="new-password"
                required
                inputProps={{
                  'aria-label': 'Password',
                  'aria-required': 'true',
                  'aria-invalid': !!errors.password,
                  'aria-describedby': errors.password ? 'password-error' : undefined,
                }}
                FormHelperTextProps={{
                  id: 'password-error',
                }}
              />

              <TextField
                {...register("confirmPassword")}
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isLoading}
                autoComplete="new-password"
                required
                inputProps={{
                  'aria-label': 'Confirm password',
                  'aria-required': 'true',
                  'aria-invalid': !!errors.confirmPassword,
                  'aria-describedby': errors.confirmPassword ? 'confirmPassword-error' : undefined,
                }}
                FormHelperTextProps={{
                  id: 'confirmPassword-error',
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
                aria-label={isLoading ? "Creating account..." : "Create new account"}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} color="inherit" aria-hidden="true" />
                    <span className="sr-only">Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link href="/login" passHref legacyBehavior>
                    <MuiLink component="a" sx={{ cursor: "pointer" }}>
                      Sign In
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
