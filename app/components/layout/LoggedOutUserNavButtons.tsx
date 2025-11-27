import { tryEnterDashboard } from "@/app/lib/clientUserGate";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoggedOutUserNavButtons() {
  const router = useRouter();

  return <Button variant="contained" className="gradient-button" onClick={() => tryEnterDashboard(router)}>Login</Button>;
}