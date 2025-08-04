import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { signUp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "./components/CustomIcons";
import { Card } from "../sign-in/SignIn";

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل 6 کاراکتر باشد.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage("نام الزامی است.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      // ارسال نام به همراه ایمیل و پسورد
      const { user, session } = await signUp(email, password, name);

      if (user) {
        console.log("ثبت‌نام موفقیت‌آمیز:", user.email);
        console.log("نام کاربر ذخیره شد:", user.user_metadata?.display_name);

        // بررسی اینکه آیا کاربر باید ایمیل را تأیید کند یا نه
        if (!session) {
          alert(
            "ثبت‌نام موفقیت‌آمیز! لطفاً ایمیل خود را بررسی کرده و لینک تأیید را کلیک کنید."
          );
          navigate("/login");
        } else {
          alert(`سلام ${name}! ثبت‌نام موفقیت‌آمیز بود.`);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("خطا در ثبت‌نام:", error.message);

      // نمایش پیغام خطای مناسب
      if (error.message.includes("User already registered")) {
        alert("این ایمیل قبلاً ثبت شده است");
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        alert("رمز عبور باید حداقل 6 کاراکتر باشد");
      } else if (error.message.includes("Invalid email")) {
        alert("فرمت ایمیل نامعتبر است");
      } else {
        alert("خطا در ثبت‌نام: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up handler (اختیاری)
  const handleGoogleSignUp = async () => {
    try {
      // const { data, error } = await supabase.auth.signInWithOAuth({
      //   provider: 'google',
      //   options: {
      //     redirectTo: `${window.location.origin}/`
      //   }
      // });
      alert("ثبت‌نام با Google هنوز پیاده‌سازی نشده است");
    } catch (error) {
      console.error("خطا در ثبت‌نام با Google:", error);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Your full name"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>یا</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignUp}
              startIcon={<GoogleIcon />}
              disabled={loading}
            >
              Sign up with Google Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Facebook")}
              startIcon={<FacebookIcon />}
              disabled={loading}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/login" variant="body2">
                Log in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
