import Home from "./pages/Home/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FavouriteProvider } from "./context/FavouriteProvider.tsx";
const theme = createTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <FavouriteProvider>
      <Home />
    </FavouriteProvider>
  </ThemeProvider>
);

export default App;
