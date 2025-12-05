'use client';

import React from "react";
import { Paper, Box, Typography, Divider, Stack } from "@mui/material";
import { FlightTakeoff, Hotel, LocalAtm, LocationOn, CalendarMonth } from "@mui/icons-material";

type SummaryItem = {
  label: string;
  sublabel: string;
  amount: string;
  icon: React.ReactNode;
};

const SUMMARY_ITEMS: SummaryItem[] = [
  {
    label: "Flights",
    sublabel: "Round trip",
    amount: "$1,250",
    icon: <FlightTakeoff sx={{ color: "#2563eb" }} />,
  },
  {
    label: "Lodging",
    sublabel: "7 nights",
    amount: "$980",
    icon: <Hotel sx={{ color: "#22c55e" }} />,
  },
  {
    label: "Budget",
    sublabel: "Daily expenses",
    amount: "$500",
    icon: <LocalAtm sx={{ color: "#f97316" }} />,
  },
];

export function TripSummary() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #f8fbff 0%, #fefbff 100%)",
        minHeight: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Trip Summary
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LocationOn sx={{ color: "#2563eb" }} />
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Tokyo, Japan
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "#4a5565" }}>
            <CalendarMonth sx={{ fontSize: 18 }} />
            <Typography variant="caption">Mar 15-22, 2024</Typography>
            <Typography variant="caption">•</Typography>
            <Typography variant="caption">7 days</Typography>
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Cost Breakdown
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {SUMMARY_ITEMS.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderRadius: 2,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: "rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "#4a5565" }}>
                  {item.sublabel}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.amount}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 1 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Total Amount
        </Typography>
        <Typography variant="h6" sx={{ color: "#2563eb", fontWeight: 700 }}>
          $2,730
        </Typography>
      </Stack>
    </Paper>
  );
}
