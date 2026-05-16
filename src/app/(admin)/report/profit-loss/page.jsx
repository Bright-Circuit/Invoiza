"use client";

import { useState, useMemo } from "react";
import {
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReplayIcon from "@mui/icons-material/Replay";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

// Example data
const DATA = [
    { type: "Purchase", amount: 1160, date: "2026-02-01" },
    { type: "SalesReturn", amount: 0, date: "2026-02-01" },
    { type: "PurchasesReturn", amount: 0, date: "2026-02-01" },
    { type: "Expenses", amount: 0, date: "2026-02-01" },
    { type: "Revenue", amount: 1780, date: "2026-02-01" },

    { type: "Purchase", amount: 500, date: "2026-02-02" },
    { type: "Revenue", amount: 800, date: "2026-02-05" },

    { type: "Purchase", amount: 700, date: "2026-01-03" },
    { type: "Expenses", amount: 300, date: "2026-01-03" },
    { type: "Revenue", amount: 900, date: "2026-01-03" },
];

export default function LossProfitReport() {
    const [filter, setFilter] = useState("daily"); 
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const filteredRows = useMemo(() => {
        if (filter === "monthly" && selectedMonth) {
            return DATA.filter((r) => r.date.startsWith(selectedMonth));
        } else if (filter === "daily" && startDate) {
            const end = endDate || startDate;
            return DATA.filter((r) => r.date >= startDate && r.date <= end);
        } else if (filter === "weekly" && startDate) {
            const end = endDate || startDate;
            return DATA.filter((r) => r.date >= startDate && r.date <= end);
        }
        return DATA;
    }, [filter, startDate, endDate, selectedMonth]);

    // Calculate totals
    const totalPurchases = filteredRows
        .filter((r) => r.type === "Purchase")
        .reduce((sum, r) => sum + r.amount, 0);
    const totalSalesReturn = filteredRows
        .filter((r) => r.type === "SalesReturn")
        .reduce((sum, r) => sum + r.amount, 0);
    const totalPurchasesReturn = filteredRows
        .filter((r) => r.type === "PurchasesReturn")
        .reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = filteredRows
        .filter((r) => r.type === "Expenses")
        .reduce((sum, r) => sum + r.amount, 0);
    const totalRevenue = filteredRows
        .filter((r) => r.type === "Revenue")
        .reduce((sum, r) => sum + r.amount, 0);
    const profitNet = totalRevenue - totalPurchases - totalExpenses;
    const lossNet = profitNet < 0 ? Math.abs(profitNet) : 0;

    const cardStyle = {
        border: "1px solid #ff8c42",
        borderRadius: "12px",
        padding: "10px",
        fontFamily: "'Play', sans-serif",
    };

    const countPurchases = filteredRows.filter((r) => r.type === "Purchase").length;
    const countSalesReturn = filteredRows.filter((r) => r.type === "SalesReturn").length;
    const countPurchasesReturn = filteredRows.filter((r) => r.type === "PurchasesReturn").length;

    return (
        <Box sx={{ mb: 0 }}>
            {/* Header & Filter */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 6,
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontFamily: "'Play', sans-serif", fontWeight: 700 }}
                >
                    Loss Profit Report
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {["daily", "weekly", "monthly"].map((f) => (
                        <Button
                            key={f}
                            onClick={() => {
                                setFilter(f);
                                setStartDate("");
                                setEndDate("");
                                setSelectedMonth("");
                            }}
                            sx={{
                                mr: 1,
                                borderRadius: "10px",
                                bgcolor: filter === f ? "#ff7a2e" : "#f3f3f3",
                                color: filter === f ? "#fff" : "#333",
                                fontWeight: 600,
                                px: 3,
                                py: 0.5,
                                textTransform: "none",
                                fontFamily: "'Play', sans-serif",
                                "&:hover": { bgcolor: "#ff7a2e", color: "#fff" },
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Button>
                    ))}

                    {filter !== "monthly" ? (
                        <>
                            <span>Select date range: </span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                }}
                            />
                            <span> To </span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <span>Select month: </span>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </>
                    )}
                </Box>
            </Box>

            {/* Date Display */}
            {filter === "monthly" && selectedMonth && (
                <Typography
                    sx={{ mb: 2, fontWeight: 500, fontFamily: "'Play', sans-serif" }}
                >
                    Showing data for{" "}
                    {new Date(selectedMonth + "-01").toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </Typography>
            )}
            {filter !== "monthly" && (startDate || endDate) && (
                <Typography
                    sx={{ mb: 2, fontWeight: 500, fontFamily: "'Play', sans-serif" }}
                >
                    Showing data for{" "}
                    {startDate ? new Date(startDate).toDateString() : "-"}
                    {endDate && ` to ${new Date(endDate).toDateString()}`}
                </Typography>
            )}

            {/* Cards */}
            <Grid container spacing={3}>
                {[
                    { label: "Purchases", value: totalPurchases, count: countPurchases, icon: <ShoppingCartIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                    { label: "Sales Return", value: totalSalesReturn, count: countSalesReturn, icon: <SwapHorizIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                    { label: "Purchases Return", value: totalPurchasesReturn, count: countPurchasesReturn, icon: <ReplayIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                    { label: "Expenses", value: totalExpenses, icon: <AccountBalanceWalletIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                    { label: "Revenue", value: totalRevenue, icon: <TrendingUpIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                    { label: "ProfitNet", value: profitNet, icon: <TrendingUpIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                    { label: "LossNet", value: lossNet, icon: <TrendingDownIcon sx={{ mb: 2, color: "#ff8c42", fontSize: 40 }} /> },
                ].map((c) => (
                    <Grid item xs={12} sm={6} md={4} key={c.label}>
                        <Card sx={cardStyle}>
                            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography sx={{ fontFamily: "'Play', sans-serif", mt: 1, fontWeight: 600, color: '#6b7280' }}>
                                        {c.label}
                                    </Typography>

                                    {c.count !== undefined && (
                                        <Typography sx={{ fontFamily: "'Play', sans-serif" }}>
                                            ({c.count})
                                        </Typography>
                                    )}
                                    <Typography variant="h5" sx={{ fontFamily: "'Play', sans-serif", fontWeight: 600, mt: 1 }}>
                                        Rs {c.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                                {c.icon}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
