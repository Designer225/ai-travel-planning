import { tryEnterDashboard, tryLogout } from "@/app/lib/clientUserGate";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoggedInUserNavButtons() {
  const router = useRouter();

  return <Box>
    <Button variant="contained" className="gradient-button" onClick={() => tryEnterDashboard(router)}>Dashboard</Button>
    <Button variant="outlined" onClick={() => tryLogout(router)}>Log out</Button>
  </Box>
}
