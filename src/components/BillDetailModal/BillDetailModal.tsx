import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Bill } from "../../types/bill";

interface Props {
  open: boolean;
  bill: Bill | null;
  onClose: () => void;
}

const BillDetailModal: React.FC<Props> = ({ open, bill, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!bill) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Bill #{bill.billNo}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        sx={{ px: 2 }}
      >
        <Tab
          label="English"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        />
        <Tab
          label="Gaeilge"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        />
      </Tabs>

      <DialogContent>
        <Box sx={{ py: 1 }}>
          {tabIndex === 0 && (
            <>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                Short Title
              </Box>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: bill.shortTitleEn }}
                sx={{ mb: 2 }}
              />
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                Long Title
              </Box>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: bill.longTitleEn }}
              />
            </>
          )}
          {tabIndex === 1 && (
            <>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                Short Title
              </Box>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: bill.shortTitleGa }}
                sx={{ mb: 2 }}
              />
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                Long Title
              </Box>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: bill.longTitleGa }}
              />
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BillDetailModal;
