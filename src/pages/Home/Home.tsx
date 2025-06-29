import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  TablePagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import { fetchBills } from "../../api/legislationApi";
import BillTable from "../../components/BillTable/BillTable";
import BillTypeFilter from "../../components/BillTypeFilter/BillTypeFilter";
import type { Bill } from "../../types/bill";
import { useFavourites } from "../../hook/useFavourites";
import BillDetailModal from "../../components/BillDetailModal/BillDetailModal";

const Home: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalResults, setTotalResults] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billTypeFilter, setBillTypeFilter] = useState("");

  const { favourites, toggleFavourite } = useFavourites();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { bills, totalResults } = await fetchBills(page, rowsPerPage);
        setBills(bills);
        setTotalResults(totalResults);
      } finally {
        setLoading(false);
      }
    };
    if (tabIndex === 0) load();
  }, [page, rowsPerPage, tabIndex]);

  useEffect(() => {
    setPage(0);
  }, [tabIndex, billTypeFilter]);

  const filteredBills = useMemo(() => {
    const target = tabIndex === 1 ? Object.values(favourites) : bills;
    // return billTypeFilter
    //   ? target.filter((b) => b.billType === billTypeFilter)
    //   : target;
    const filtered = billTypeFilter
      ? target.filter((b) => b.billType === billTypeFilter)
      : target;

    // Apply pagination to favourites
    if (tabIndex === 1) {
      return filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }

    return filtered;
  }, [tabIndex, bills, favourites, billTypeFilter, page, rowsPerPage]);

  const uniqueBillTypes = useMemo(() => {
    const list = tabIndex === 1 ? Object.values(favourites) : bills;
    return Array.from(new Set(list.map((b) => b.billType))).sort();
  }, [tabIndex, bills, favourites]);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="center">
        <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
          Oireachtas Bills Information
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ mb: 2 }}
        >
          <Tab
            label="All Bills"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Favourites"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>

        {!loading && (
          <BillTypeFilter
            value={billTypeFilter}
            onChange={setBillTypeFilter}
            options={uniqueBillTypes}
          />
        )}
      </Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <BillTable
            bills={filteredBills}
            favourites={favourites}
            onSelectBill={setSelectedBill}
            onToggleFavourite={toggleFavourite}
            filter={billTypeFilter}
          />
          {selectedBill && (
            <BillDetailModal
              open={!!selectedBill}
              bill={selectedBill}
              onClose={() => setSelectedBill(null)}
            />
          )}

          {/* {tabIndex === 0 && ( */}
          <TablePagination
            component="div"
            count={
              tabIndex === 0
                ? totalResults
                : (billTypeFilter
                    ? Object.values(favourites).filter(
                        (b) => b.billType === billTypeFilter
                      )
                    : Object.values(favourites)
                  ).length
            }
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setPage(0);
              setRowsPerPage(parseInt(e.target.value, 10));
            }}
          />
          {/* )} */}
        </>
      )}
    </Box>
  );
};

export default Home;
