'use client';

import { AppBar, Toolbar, Box, Typography, Container, Button } from "@mui/material";
import { Flight, Explore } from "@mui/icons-material";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { tryEnterDashboard, tryGetCurrentUser, tryLogout } from "@/app/lib/clientUserGate";
import { useRouter } from "next/navigation";
import SiteUser from "@/types";

export function Navigation() {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  const [user, setUser] = useState<SiteUser | undefined>(undefined);

  useEffect(() => {
    startTransition(async () => {
      const siteUser = await tryGetCurrentUser(router);
      setUser(siteUser);
      setShowButtons(true);
    });
  }, []);

  const handleDashboard = () => {
    startTransition(async () => {
      await tryEnterDashboard(router);
    })
  }

  const handleLogout = () => {
    startTransition(async () => {
      await tryLogout(router);
    })
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        bgcolor: "rgba(255,255,255,1)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href='/'>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box 
                  className="gradient-background"
                  sx={{ 
                    position: "relative", 
                    width: 40, 
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  <Flight sx={{ color: "white", fontSize: 24 }} />
                  <Explore 
                    sx={{ 
                      position: "absolute",
                      top: -4,
                      right: -4,
                      color: "#AD46FF",
                      bgcolor: "white",
                      borderRadius: "50%",
                      fontSize: 16,
                      padding: "2px",
                    }} 
                  />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "text.primary",
                      fontSize: "20px",
                      lineHeight: "28px",
                      letterSpacing: "-0.4492px",
                    }}
                  >
                    TripAI
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#4a5565",
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: "-0.1504px",
                    }}
                  >
                    Your AI Travel Planning Assistant
                  </Typography>
                </Box>
              </Box>
            </Link>
            <Box>
              { showButtons && (
                user === undefined
                ? <Button variant="contained" className="gradient-button" onClick={handleDashboard}>Login</Button>
                : <Box sx={{ gap: 1, display: 'flex' }}>
                    <Button variant="contained" className="gradient-button" onClick={handleDashboard}>Dashboard</Button>
                    <Button variant="outlined" onClick={handleLogout}>Log out</Button>
                  </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
