import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";

import { SidebarContext } from "../context/SidebarContext";

import NewChatEntry from "./NewChatEntry";
import Modal from "react-modal";

// import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { MD5 } from "../utils/const";

const theme = createTheme();

const Navbar = () => {
  const { openSidebar, isScreenLarge } = useContext(SidebarContext);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [token, setToken] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    localStorage.setItem("user-details", false);
    // function checkUserData() {
    const user_token = localStorage.getItem("hubid-api-clients");
    if (user_token) {
      setToken(user_token);
    } else {
      setToken(null);
    }
    getLoggedInUserDetails();
  }, []);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backdropFilter: "blur(5px)",
      backgroundColor: "rgba(0,0,0,0.44)",
    },
  };
  Modal.setAppElement("#__next");

  let subtitle;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getLoggedInUserDetails = async () => {
    try {
      let url = `https://id.hubculture.com/user`;
      const user_token = localStorage.getItem("hubid-api-clients");
      // if (token) {
      let Items = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Private-Key": "private_5d265de1d9204f6235830ce2",
          Authorization: `Bearer ${user_token}`,
        },
      });
      let ListData = await Items.json();
      setUserDetails(ListData.data);
      localStorage.setItem("user-details", true);
    } catch (err) {
      console.log("token :err :", err);
    }
  };

  const SignIn = () => {
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formdata = new FormData(event.currentTarget);

      const data = new URLSearchParams();
      data.append("email", formdata.get("email"));
      data.append("password", formdata.get("password"));
      let url = "https://id.hubculture.com/auth";
      if (formdata.get("email") !== "" && formdata.get("password") !== "") {
        try {
          let Items = await fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Public-Key": "public_153222247f4cbe2511208120a",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data.toString(),
          });
          let ListData = await Items.json();
          const listDataToken = ListData?.data?.token;

          localStorage.setItem("hubid-api-clients", listDataToken);
          setToken(listDataToken);
          setIsOpen(false);

          const userAgent = navigator.userAgent;
          const hashString = MD5(userAgent);

          const userId = ListData?.data?.user_id;
          const hubculture = `${userId} - ${hashString}`;
          document.cookie = `hubculturecom = ${hubculture} ; path=/`;

          window.location.reload();
          getUserDetails();
          // window.location.reload();
        } catch (err) {
          console.log("ERROR : ", err);
        }

        // return ListData;
      }
    };

    const getUserDetails = async () => {
      try {
        let url = `https://id.hubculture.com/user`;
        const user_token = localStorage.getItem("hubid-api-clients");
        // if (token) {
        let Items = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Private-Key": "private_5d265de1d9204f6235830ce2",
            Authorization: `Bearer ${user_token}`,
          },
        });
        let ListData = await Items.json();
        setUserDetails(ListData.data);
        localStorage.setItem("user-details", true);
      } catch (err) {
        console.log("token :err :", err);
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  };

  const logoutUser = () => {
    localStorage.removeItem("hubid-api-clients");
    document.cookie =
      "hubculturecom=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
    window.location.reload();
  };

  return (
    <div>
      <div>
        {/* <button onClick={openModal}>Open Modal</button> */}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <SignIn />
        </Modal>
      </div>
      <div className="text-white py-4">
        <div className="container mx-auto">
          <div className="flex gap-5 w-full justify-between">
            <div className="flex gap-4 items-center">
              <Image width={40} height={40} src="/logo.png" alt="Logo" />
              <span className="text-2xl">Zeke</span>
            </div>

            {isScreenLarge ? (
              <NewChatEntry onClick={openSidebar} image={<GiHamburgerMenu />} />
            ) : (
              <div className="flex h-full justify-between gap-3">
                <NewChatEntry
                  image={"📠"}
                  chatTitle={"Chat with me"}
                  link={"/"}
                />
                <NewChatEntry
                  image={"🌐"} // Added globe emoji for translator
                  chatTitle={"Translator"}
                  link={"/translator"} // You can change the link as needed
                />
                <NewChatEntry
                  image={"🌐"} // Added globe emoji for translator
                  chatTitle={"Deepgram"}
                  link={"/deepgram"} // You can change the link as needed
                />
                <NewChatEntry
                  image={"🤔"}
                  chatTitle={"Dreamscape"}
                  link={"/dreamscape"}
                />
                <NewChatEntry image={"⛏"} chatTitle={"Mint"} link={"/mint"} />
                <NewChatEntry
                  image={"👪"}
                  chatTitle={"Membership"}
                  link={"https://hubculture.com/membership"}
                />
                <NewChatEntry
                  image={"❔"}
                  chatTitle={"About"}
                  link={"https://hubculture.com/aboutus"}
                />
                {!token && (
                  <NewChatEntry
                    image={"📱"}
                    chatTitle={"Login"}
                    // link={"https://hubculture.com/contact"}
                    onClick={openModal}
                  />
                )}
                {token && (
                  <NewChatEntry
                    image={"📱"}
                    chatTitle={"Logout"}
                    // link={"https://hubculture.com/contact"}
                    onClick={logoutUser}
                  />
                )}

                {/* <NewChatEntry
                onClick={toggleTheme}
                image={theme === "light" ? "🌙" : "☀"}
                chatTitle={theme === "light" ? "Dark Mode" : "Light Mode"}
              /> */}
                {/* <NewChatEntry
              image={"📱"}
              chatTitle={"Install Me"}
              link={"/installl"}
            /> */}
              </div>
            )}
            {userDetails?.id ? (
              <div className="flex gap-4 items-center">
                <div>
                  {/* <Avatar sx={{ bgcolor: deepPurple[500] }}>{userDetails.first.charAt(0)}</Avatar> */}
                  <p>{userDetails.first}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <div>
                  {/* <Avatar sx={{ bgcolor: deepPurple[500] }}></Avatar> */}
                  <Box
                    component="img"
                    sx={{
                      height: 50,
                      width: 50,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="Guest User Icon"
                    src="./guest_User.png"
                  />
                  <p style={{ paddingLeft: "3px" }}>Guest</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;