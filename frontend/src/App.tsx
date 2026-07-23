import {
  Card,
  CardContent,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { HelloWorld } from "./features/hello/HelloWorld";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent>
            <Typography component="h1" variant="h4" gutterBottom>
              Runtime
            </Typography>
            <HelloWorld />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;
