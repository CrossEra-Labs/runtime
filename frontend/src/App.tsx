import {
  Card,
  CardContent,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
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
            <Typography color="text.secondary">
              Das React-Frontend läuft.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;
