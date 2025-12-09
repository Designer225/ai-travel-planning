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
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign up to start planning your next adventure
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: "100%" }}
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
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
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
