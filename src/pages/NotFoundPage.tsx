import { Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <Container
        maxWidth={false}
        sx={{
          bgcolor: "snow",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: "center", alignItems: "center", p: 3 }}>
          <Typography variant={"h1"}>404 </Typography>
          <Typography variant={"h4"}>PAGE NOT FOUND</Typography>
          <Typography>We can't seem to find the page you're looking for</Typography>
          <Button component={NavLink} to={"/"} variant={"contained"}>
            Back to HomePage
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
