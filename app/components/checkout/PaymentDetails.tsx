'use client';

import React, { startTransition, useState } from "react";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField'
import { CreditCard, Lock } from "@mui/icons-material";
import { tryEnterItineraryBuilder, tryEnterMyTrips } from "@/app/lib/clientUserGate";
import { useRouter } from "next/navigation";

type PaymentMethod = {
  id: number;
  label: string;
  last4: string;
  expiry: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    label: "Visa",
    last4: "4242",
    expiry: "12/25",
  },
  {
    id: 2,
    label: "Mastercard",
    last4: "8888",
    expiry: "09/26",
  },
];

type Props = {
  showToast: (message: string, severity: "success" | "error" | "info" | "warning", description?: string) => void;
};

export function PaymentDetails({ showToast }: Props) {
  const router = useRouter();
  const [useExisting, setUseExisting] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [selectedCardId, setSelectedCardId] = useState(PAYMENT_METHODS[0].id);
  const [newCard, setNewCard] = useState({ number: "", name: "", expiry: "" });

  const handleComplete = () => {
    // make sure to handle payment failure, for now that's in the future
    showToast("Booking completed", "success", "Your payment has been processed securely.");
    startTransition(async () => {
      await tryEnterMyTrips(router);
    });
  };

  const handleCancel = () => {
    showToast("Checkout canceled", "info", "You can resume whenever you're ready.");
    startTransition(async () => {
      await tryEnterItineraryBuilder(router, undefined, /* whatever trip is in the cart */)
    })
  };

  const handleAddNewCard = () => {
    if (!newCard.number || !newCard.name || !newCard.expiry) {
      showToast("Enter card details", "error", "Please fill card number, name, and expiry.");
      return;
    }

    const trimmedNumber = newCard.number.replace(/\s+/g, "");
    const last4 = trimmedNumber.slice(-4);
    const type = trimmedNumber.startsWith("4") ? "Visa" : trimmedNumber.startsWith("5") ? "Mastercard" : "Card";

    const newMethod: PaymentMethod = {
      id: Date.now(),
      label: type,
      last4,
      expiry: newCard.expiry,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setSelectedCardId(newMethod.id);
    setUseExisting(false);
    setNewCard({ number: "", name: "", expiry: "" });
    showToast("New card added", "success");
  };

  const hasSelection = useExisting ? !!selectedCardId : !!selectedCardId;
  const disableComplete = !hasSelection;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #ffffff 0%, #fbf9ff 100%)",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Payment Details</Typography>
        <Lock sx={{ fontSize: 18, color: "#4a5565" }} />
      </Stack>

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.25,
            borderRadius: 2,
            border: useExisting ? "2px solid #2563eb" : "1px solid rgba(0,0,0,0.12)",
            background: useExisting ? "linear-gradient(90deg, #f4f8ff 0%, #f7f4ff 100%)" : "#fff",
          }}
          onClick={() => {
            setUseExisting(true);
            if (!selectedCardId && paymentMethods.length) {
              setSelectedCardId(paymentMethods[0].id);
            }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Radio checked={useExisting} slotProps={{
              input: {
                "aria-labelledby": "use-existing-method"
              }
            }}/>
            <Typography variant="body2" sx={{ flex: 1 }} id='use-existing-method'>
              Use existing payment method
            </Typography>
            <CreditCard sx={{ color: "#4a5565", fontSize: 18 }} />
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 1.25,
            borderRadius: 2,
            border: !useExisting ? "2px solid #2563eb" : "1px solid rgba(0,0,0,0.12)",
            background: !useExisting ? "linear-gradient(90deg, #f4f8ff 0%, #f7f4ff 100%)" : "#fff",
          }}
          onClick={() => {
            setUseExisting(false);
            setSelectedCardId(0);
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Radio checked={!useExisting} slotProps={{
              input: {
                "aria-labelledby": "add-new-method"
              }
            }}/>
            <Typography variant="body2" sx={{ flex: 1 }} id='add-new-method'>
              Add new payment method
            </Typography>
            <CreditCard sx={{ color: "#4a5565", fontSize: 18 }} />
          </Stack>
        </Paper>
      </Stack>

      {useExisting ? (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Card
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {paymentMethods.map((card, index) => {
              const isSelected = selectedCardId === card.id;
              return (
                <Paper
                  key={card.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: isSelected ? "2px solid #2563eb" : "1px solid rgba(0,0,0,0.12)",
                    background: isSelected ? "linear-gradient(90deg, #f4f8ff 0%, #f7f4ff 100%)" : "#f6f7f9",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Radio checked={isSelected} slotProps={{
                      input: {
                        'aria-labelledby': `${card.label}-${card.last4}`
                      }
                    }}/>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} id={`${card.label}-${card.last4}`}>
                          {card.label} •••• {card.last4}
                        </Typography>
                        {index === 0 && (
                          <Chip
                            className="gradient-background"
                            label="Default"
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.7rem",
                              color: "white",
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="caption" sx={{ color: "#4a5565" }}>
                        Expires {card.expiry}
                      </Typography>
                    </Box>
                    <CreditCard sx={{ color: "#4a5565", fontSize: 18 }} />
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </>
      ) : (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle2">New Card Details</Typography>
          <TextField
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={newCard.number}
            onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
            fullWidth
            inputProps={{ maxLength: 19 }}
            sx={{ 
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#f3f3f5",
                "& fieldset": { border: "none" },
              },
            }}
          />
          <TextField
            label="Cardholder Name"
            placeholder="John Smith"
            value={newCard.name}
            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
            fullWidth
            sx={{ 
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#f3f3f5",
                "& fieldset": { border: "none" },
              },
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Expiry Date"
              placeholder="MM/YY"
              value={newCard.expiry}
              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
              inputProps={{ maxLength: 5 }}
              fullWidth
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  bgcolor: "#f3f3f5",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <TextField
              label="CVV"
              placeholder="123"
              type="password"
              inputProps={{ maxLength: 4 }}
              fullWidth
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  bgcolor: "#f3f3f5",
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Stack>
          <Button
            variant="outlined"
            onClick={handleAddNewCard}
            sx={{ alignSelf: "flex-start" }}
          >
            Add Card
          </Button>
        </Stack>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          background: "#f6f8fd",
          border: "1px solid rgba(0,0,0,0.06)",
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Lock sx={{ fontSize: 18, color: "#2563eb", mt: "2px" }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Secure Payment
            </Typography>
            <Typography variant="caption" sx={{ color: "#4a5565" }}>
              Your payment information is encrypted and secure. This is a mock checkout for demonstration purposes only.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button
        variant="contained"
        fullWidth
        className="gradient-button"
        sx={{
          py: 1.2,
        }}
        onClick={handleComplete}
        disabled={disableComplete}
      >
        Complete Booking - $2,730
      </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ py: 1.2 }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
}
