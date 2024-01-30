import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventIcon from "@mui/icons-material/Event";
import { VacationDetails } from "../services/vacationService/vacation-service";
import { format } from "date-fns";
import { useAppSelector } from "../redux/hooks";
export default function VacationCard({ vacation: vacationDetails }: { vacation: VacationDetails }) {
  const user = useAppSelector((state) => state.auth.user);
  const isFollowed = vacationDetails.followers.includes(user?._id || "");

  const formattedDate = {
    checkIn: format(vacationDetails.checkIn, "dd/LL/yyyy"),
    checkOut: format(vacationDetails.checkOut, "dd/LL/yyyy"),
  };
  return (
    <Card
      sx={{
        maxWidth: { sm: "500px", md: "500px", lg: "300px" },
        m: 2,
      }}
    >
      <CardMedia
        component={Box}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1,
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "200px",
        }}
      >
        <Chip
          sx={{ maxWidth: "90px" }}
          icon={<FavoriteIcon color={isFollowed ? "error" : "info"} />}
          variant={"filled"}
          color={isFollowed ? "warning" : "info"}
          label={`Like ${vacationDetails.followers.length || "0"}`}
        />
        <Typography variant={"h5"} sx={{ color: "white", pb: 1 }}>
          {vacationDetails.destination}
        </Typography>
      </CardMedia>
      <CardContent
        sx={{
          position: "relative",
          top: -10,
          bgcolor: "lightskyblue",
          borderRadius: 2,
          display: "flex",
        }}
      >
        <EventIcon />
        <Typography sx={{ ml: 1, pb: 1 }}>
          {formattedDate.checkIn}-{formattedDate.checkOut}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          position: "relative",
          top: -20,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Typography>{vacationDetails.description}</Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "center", mt: -3, p: 1 }}>
        <Button variant={"contained"} sx={{ width: "80%" }}>
          {vacationDetails.price}
        </Button>
      </Box>
    </Card>
  );
}
