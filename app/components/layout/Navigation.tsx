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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// import Link from 'next/link';
// import { Plane } from 'lucide-react';
// import { Button } from '../ui/button';

// export function Navigation() {
//   return (
//     <nav className="border-b bg-white" aria-label="Main navigation">
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md" aria-label="TripCraft home">
//           <Plane className="w-8 h-8 text-blue-600" aria-hidden="true" />
//           <span className="text-xl">TripCraft</span>
//         </Link>
        
//         <div className="flex items-center gap-1">
//           <Link
//           href="/my-trips"
//           className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md px-2 py-1">
//             <Button variant="outline" aria-label="Check your trips">
//               My trips
//             </Button>
//           </Link>
//           {/* TODO: redirect to login page */}
//           <Link href="/dashboard">
//             <Button
//             variant="outline"
//             className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
//             aria-label="Sign in to your account">
//               Sign in
//             </Button>
//           </Link>
//           {/* TODO: add alternative buttons that will access the dashboard (or open a hamburger menu doing so) */}
//         </div>
//       </div>
//     </nav>
//   );
// }
