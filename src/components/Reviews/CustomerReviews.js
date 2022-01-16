import { React, useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import axios from "../../axios";

// Components
import { Box, Stack, Collapse, Button, TextField } from "@mui/material";
import { Typography, Rating, CircularProgress } from "@mui/material";

// Icons
import StarIcon from "@mui/icons-material/StarRounded";
import DownIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import UpIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import UpdateIcon from "@mui/icons-material/FileUploadTwoTone";

const responses = [
  "Hated it",
  "Don't like it",
  "Just OK",
  "Liked it",
  "Loved It",
];

const Reviews = () => {
  const history = useHistory();

  // User Context
  const [user] = useContext(UserContext);

  //Funtionality States
  const [Loading, setLoading] = useState(true);
  const [updateLoad, setupdateLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ratings, setRatings] = useState(5);
  const [hover, sethover] = useState(5);
  const [desc, setDesc] = useState("");
  const [updated, setupdated] = useState(false);

  // Data States
  const [Reviews, setReviews] = useState([]);

  // Getting Website Reviews
  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("/getTopWebsiteReviews")
        .then((response) => {
          setReviews(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchData();
  }, [updated]);

  // Adding Website Review
  const handelAddReview = () => {
    setupdateLoading(true);
    axios
      .post("/updateWebsiteReview", {
        rating: ratings,
        review: desc,
      })
      .then((response) => {
        setupdateLoading(false);
        setupdated(true);
        setTimeout(() => {
          setupdated(false);
        }, 5000);
      })
      .catch((error) => {
        setupdateLoading(false);
        // setupdated(true);
      });
  };
  return (
    <Stack>
      <Stack
        className="reviews"
        spacing={2}
        sx={{ backgroundColor: "#0a2540", padding: "10px", color: "white" }}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4" align="center">
          <strong>What readers say about us?</strong>
        </Typography>
        <Typography variant="caption" align="center">
          <strong>
            This book is concerned with creating typography and is essential for
            professionals who regularly work for clients.
          </strong>
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row", md: "row", lg: "row" }}
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          sx={{ width: "100%" }}
        >
          {Loading ? (
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={2}
              direction="row"
            >
              <Typography variant="caption">Loading...</Typography>
              <CircularProgress size={15} color="inherit" />
            </Stack>
          ) : (
            Reviews.map((review) => (
              <Box
                sx={{
                  backgroundColor: "#2d5a87",
                  height: 250,
                  width: 250,
                  borderRadius: "10px",
                }}
                key={review._id}
              >
                <Stack
                  sx={{ width: "100%", padding: "10px", height: "100%" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="space-between"
                >
                  <Typography variant="caption">
                    <strong>{review.userName}</strong>
                  </Typography>
                  <Typography variant="caption" align="justify">
                    <strong>{review.review}</strong>
                  </Typography>
                  <Rating
                    value={review.rating}
                    readOnly
                    emptyIcon={
                      <StarIcon sx={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                    icon={<StarIcon fontSize="inherit" />}
                    size="large"
                  />
                </Stack>
              </Box>
            ))
          )}
        </Stack>
        <Button
          variant="contained"
          sx={{ maxWidth: 400 }}
          endIcon={open ? <UpIcon /> : <DownIcon />}
          onClick={() => {
            if (user) setOpen((prev) => !prev);
            else history.push("/Login");
          }}
          color="warning"
        >
          {user ? "Add Your Review" : "Login To Add Your Review"}
        </Button>
        <Collapse in={open} timeout={500} sx={{ width: "100%" }}>
          <Stack
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{
              padding: "10px",
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <Typography component="legend">Rating</Typography>
            <Rating
              defaultValue={ratings}
              emptyIcon={<StarIcon sx={{ opacity: 0.9 }} fontSize="inherit" />}
              icon={<StarIcon fontSize="inherit" />}
              size="large"
              onChange={(event, newValue) => {
                setRatings(newValue);
              }}
              onChangeActive={(event, newHover) => {
                sethover(newHover);
              }}
            />
            <Typography component="legend">{responses[hover - 1]}</Typography>
            <TextField
              variant="standard"
              label="Review"
              color="warning"
              fullWidth
              sx={{
                "& label": { fontFamily: "PT sans", color: "white" },
                "& input": { color: "white" },
              }}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
            <Button
              endIcon={
                updateLoad ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  <UpdateIcon />
                )
              }
              disabled={updateLoad}
              variant="contained"
              color="warning"
              onClick={handelAddReview}
            >
              Submit
            </Button>
            {updated ? (
              <Typography variant="caption">
                Review Updated SuccessFully!
              </Typography>
            ) : null}
          </Stack>
        </Collapse>
      </Stack>
    </Stack>
  );
};
export default Reviews;
