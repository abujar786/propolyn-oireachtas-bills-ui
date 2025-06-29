import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type { Bill } from "../../types/bill";
import { styles } from "./styles";

interface Props {
  bills: Bill[];
  filter: string;
  onSelectBill: (bill: Bill) => void;
  favourites: Record<string, Bill>;
  onToggleFavourite: (bill: Bill) => void;
}

const BillTable: React.FC<Props> = ({
  bills,
  filter,
  onSelectBill,
  favourites,
  onToggleFavourite,
}) => {
  const filteredBills = filter
    ? bills.filter(
        (bill) => bill.billType.toLowerCase() === filter.toLowerCase()
      )
    : bills;

  return (
    <>
      <TableContainer component={Paper} sx={styles.max_height}>
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.headerCell}>Bill No</TableCell>
              <TableCell sx={styles.headerCell}>Type</TableCell>
              <TableCell sx={styles.headerCell}>Status</TableCell>
              <TableCell sx={styles.headerCell}>Sponsor</TableCell>
              <TableCell sx={styles.headerCell}>Favourite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills.map((bill, index) => {
              const isFavourite = !!favourites[bill.uri];

              return (
                <TableRow
                  key={`${bill.billNo}-${index}`}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => onSelectBill(bill)}
                  data-testid={`bill-row-${bill.billNo}`}
                >
                  <TableCell
                    sx={[
                      {
                        width: "15%",
                      },
                      styles.cellClass,
                    ]}
                  >
                    {bill.billNo}
                  </TableCell>
                  <TableCell
                    sx={[
                      {
                        width: "15%",
                      },
                      styles.cellClass,
                    ]}
                  >
                    {bill.billType}
                  </TableCell>
                  <TableCell
                    sx={[
                      {
                        width: "15%",
                      },
                      styles.cellClass,
                    ]}
                  >
                    {bill.status ?? "N/A"}
                  </TableCell>
                  <TableCell
                    sx={[
                      {
                        width: "45%",
                      },
                      styles.cellClass,
                    ]}
                  >
                    {bill.sponsors?.[0]?.sponsor?.as?.showAs ?? "N/A"}
                  </TableCell>
                  <TableCell
                    sx={[
                      {
                        width: "10%",
                      },
                      styles.cellClass,
                    ]}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      onToggleFavourite(bill);
                    }}
                  >
                    <IconButton data-testid={`favourite-button-${bill.billNo}`}>
                      {isFavourite ? (
                        <StarIcon color="warning" />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BillTable;
