import { AppBar, Toolbar, Typography, Button, IconButton, Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useState } from "react";
import PriceFinderModal from "./PriceFinderModal";
import { useUser } from "../contexts/UserContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { logout } = useUser(); 
  const [openFinder, setOpenFinder] = useState(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="fixed" sx={{ top: 0, backgroundColor: "#bedef7", p: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Left Side: Home Link */}
          <Typography
            variant="h6"
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/")}
          >
            Splurge O' Scrooge
          </Typography>

          {/* Center: Navigation Arrows */}
          <div>
            <IconButton color="inherit" onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate(1)}>
              <ArrowForward />
            </IconButton>
          </div>

          {/* Right Side: Logout & Profile */}
          <div>
            <Button color="inherit" onClick={logout} sx={{ mr: 2 }}>
              Logout
            </Button>
            <Button color="inherit" onClick={() => navigate("/profile")}>
              Profile
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Bottom Navigation Bar */}
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label="Price Finder"
            icon={<span>🔍</span>}
            onClick={() => setOpenFinder(true)}
          />
          <BottomNavigationAction
            label="Needs"
            icon={<span>🏠</span>}
            onClick={() => navigate("/needs")}
          />
          <BottomNavigationAction
            label="Wants"
            icon={<span>🎮</span>}
            onClick={() => navigate("/wants")}
          />
          <BottomNavigationAction
            label="Savings"
            icon={<span>💰</span>}
            onClick={() => navigate("/savings")}
          />
        </BottomNavigation>
      </Paper>

      {/* Price Finder Modal */}
      <PriceFinderModal
        open={openFinder}
        onClose={() => setOpenFinder(false)}
      />
    </>
  );
}
