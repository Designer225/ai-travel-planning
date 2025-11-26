'use client';

import { AppBar, Toolbar, Box, Typography, Container } from "@mui/material";
import { Flight, Explore } from "@mui/icons-material";

export function Navigation() {
  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        bgcolor: "rgba(255,255,255,0.8)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box 
              sx={{ 
                position: "relative", 
                width: 40, 
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
