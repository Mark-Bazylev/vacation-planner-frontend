import React from "react";
import { login } from "../redux/authentication/authSlice";
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
import {
  LoginParams,
  RegisterParams,
} from "../services/authService/auth-service";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NavLink } from "react-router-dom";
import { emailRegex } from "../utils";
interface LoginPageProps {}

const RegisterPage: React.FC<LoginPageProps> = () => {
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterParams>();

  const onRegister: SubmitHandler<RegisterParams> = async (credentials) => {
    // try {
    //   const res = await dispatch(login(credentials)).unwrap();
    //   console.log(res);
    // } catch (e) {
    //   console.log(e);
    // }
  };
  return (
    <Paper sx={{ p: 3 }} elevation={8}>
      <Box component="form" noValidate onSubmit={handleSubmit(onRegister)}>
        <Stack spacing={2} alignItems={"center"}>
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
            {...register("lastName", {
              required: "First Name must be provided",
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message || " "}
          />
          <TextField
            fullWidth={true}
            type="text"
            label="Last Name"
            {...register("firstName", {
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

          <FormControl
            sx={{ m: 1, minWidth: "25ch" }}
            fullWidth={true}
            variant="outlined"
          >
            <InputLabel
              error={!!errors.password}
              htmlFor="outlined-adornment-password"
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password must be provided",
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
            <FormHelperText error={true}>
              {errors.password?.message || " "}
            </FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth={true}
          >
            Sign In
          </Button>

          <Divider flexItem />
          <Button
            component={NavLink}
            to={"/auth/register"}
            variant="contained"
            color="success"
            fullWidth={true}
          >
            Create a new account
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
