import React from "react";
import { createAccount } from "../redux/authentication/authSlice";
import { useAppDispatch } from "../redux/hooks";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateAccountParams } from "../services/authService/auth-service";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import { emailRegex } from "../utils";
interface LoginPageProps {}

const RegisterPage: React.FC<LoginPageProps> = () => {
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountParams>();
  const navigate = useNavigate();
  const onRegister: SubmitHandler<CreateAccountParams> = async (credentials) => {
    try {
      await dispatch(createAccount(credentials)).unwrap();
      navigate("/home");
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  return (
    <Paper sx={{ p: 3 }} elevation={8}>
      <Box sx={{ width: "250px" }} component="form" noValidate onSubmit={handleSubmit(onRegister)}>
        <Stack spacing={1} alignItems={"center"}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "transparent",
                color: "darkgrey",
                fontSize: "48px",
                mr: 1,
              }}
            >
              <AccountCircleOutlinedIcon fontSize={"inherit"} />
            </Avatar>
            <Typography variant={"h6"}>Create Account</Typography>
          </Box>
          <TextField
            fullWidth={true}
            type="text"
            label="First Name"
            {...register("firstName", {
              required: "First Name must be provided",
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message || " "}
          />
          <TextField
            fullWidth={true}
            type="text"
            label="Last Name"
            {...register("lastName", {
              required: "First Name must be provided",
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message || " "}
          />

          <TextField
            fullWidth={true}
            type="email"
            label="Email"
            {...register("email", {
              required: "Email must be provided",
              pattern: {
                value: emailRegex,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message || " "}
          />

          <FormControl sx={{ m: 1, minWidth: "25ch" }} fullWidth={true} variant="outlined">
            <InputLabel error={!!errors.password} htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password must be provided",
                minLength: { value: 4, message: "Password must be at least 4 characters long" },
              })}
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            <FormHelperText sx={{ height: "40px" }} error={true}>
              {errors.password?.message}
            </FormHelperText>
          </FormControl>
          <NavLink to={"/auth/login"}>Already have an Account? Log In</NavLink>
          <Divider flexItem />
          <Button variant="contained" color="primary" type="submit" fullWidth={true}>
            Create Account
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
