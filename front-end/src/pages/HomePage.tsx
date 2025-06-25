import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        Welcome to the Home Page!
      </Typography>
      <Typography variant="body1">This is a simple homepage. Feel free to explore the application.</Typography>
    </Box>
  );
}
export default HomePage;
