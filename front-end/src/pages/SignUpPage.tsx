import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../template/AppTheme";
import ColorModeSelect from "../template/ColorModeSelect";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  padding: theme.spacing(2),
  position: "absolute",
  zIndex: 0,
  inset: 0,
  backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover", // Arka planın ekranı tamamen kaplaması için
  backgroundPosition: "center", // Arka planın ortalanması
  ...theme.applyStyles("dark", {
    backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }),
}));

function SignUpPage() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [surnameError, setSurnameError] = React.useState(false);
  const [surnameErrorMessage, setSurnameErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Snackbar kontrolü
  const [snackbarMessage, setSnackbarMessage] = React.useState(""); // Snackbar mesajı

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const name = data.get("name") as string;
    const surname = data.get("surname") as string;

    if (!validateInputs()) {
      setSnackbarMessage("Please fix the errors in the form.");
      setSnackbarOpen(true); // Snackbar açılır
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, surname }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      console.log("Signup successful");
      navigate("/"); // Kayıt başarılıysa LoginPage'e yönlendir
    } catch (error) {
      console.error("Signup error:", error);
      setSnackbarMessage("Signup failed. Please try again.");
      setSnackbarOpen(true); // Snackbar açılır
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;
    const surname = document.getElementById("surname") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage("Name must be at least 2 characters long.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!surname.value || surname.value.length < 2) {
      setSurnameError(true);
      setSurnameErrorMessage("Surname must be at least 2 characters long.");
      isValid = false;
    } else {
      setSurnameError(false);
      setSurnameErrorMessage("");
    }

    return isValid;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignUpContainer
        direction="column"
        justifyContent="space-between"
      >
        <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <Stack
              direction={"row"}
              spacing={3}
            >
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <TextField
                  error={nameError}
                  helperText={nameErrorMessage}
                  id="name"
                  name="name"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="surname">Surname</FormLabel>
                <TextField
                  error={surnameError}
                  helperText={surnameErrorMessage}
                  name="surname"
                  id="surname"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign Up
            </Button>
          </Box>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SignUpContainer>
    </AppTheme>
  );
}
export default SignUpPage;
