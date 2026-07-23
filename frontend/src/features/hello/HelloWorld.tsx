import {
  Alert,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useHello } from "./useHello";

export const HelloWorld = () => {
  const query = useHello();

  if (query.isPending) {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <CircularProgress size={24} />
        <Typography>Backend wird geladen...</Typography>
      </Stack>
    );
  }

  if (query.isError) {
    return <Alert severity="error">Fehler: {query.error.message}</Alert>;
  }

  return <Alert severity="success">{query.data.message}</Alert>;
};
