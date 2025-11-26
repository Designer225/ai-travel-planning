'use client';

import { useState } from "react";
import {
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { CreditCard, Add, Delete } from "@mui/icons-material";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8888",
    expiry: "09/26",
    isDefault: false,
  },
];

interface PaymentSettingsProps {
  showToast: (message: string, severity: "success" | "error" | "info" | "warning", description?: string) => void;
}

export function PaymentSettings({ showToast }: PaymentSettingsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    showToast("Default payment method updated", "success");
  };

  const handleRemove = (id: string) => {
    const method = paymentMethods.find((m) => m.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      showToast("Cannot remove default payment method", "error", "Please set another card as default first.");
      return;
    }
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    showToast("Payment method removed", "success");
  };

  const handleAddCard = () => {
    // In a real app, this would integrate with a payment processor
    const last4 = newCard.number.slice(-4);
    const type = newCard.number.startsWith("4") ? "Visa" : "Mastercard";
    
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type,
      last4,
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddDialogOpen(false);
    setNewCard({ number: "", name: "", expiry: "", cvv: "" });
    showToast("Payment method added successfully", "success");
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Payment Settings</Typography>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
              opacity: 0.9,
            },
          }}
        >
          Add Card
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {paymentMethods.map((method) => (
          <Paper
            key={method.id}
            elevation={0}
            sx={{ 
              p: 2, 
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCard sx={{ color: "#155dfc", fontSize: 20 }} />
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1">
                      {method.type} •••• {method.last4}
                    </Typography>
                    {method.isDefault && (
                      <Chip
                        label="Default"
                        size="small"
                        sx={{
                          background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
                          color: "white",
                          height: 20,
                          fontSize: "0.7rem",
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Expires {method.expiry}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!method.isDefault && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleRemove(method.id)}
                >
                  <Delete fontSize="small" sx={{ color: "#4a5565" }} />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a new credit or debit card to your account.
          </Typography>

          <TextField
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={newCard.number}
            onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
            fullWidth
            inputProps={{ maxLength: 16 }}
            sx={{ 
              mb: 2,
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
              mb: 2,
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#f3f3f5",
                "& fieldset": { border: "none" },
              },
            }}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Expiry Date"
              placeholder="MM/YY"
              value={newCard.expiry}
              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
              inputProps={{ maxLength: 5 }}
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
              value={newCard.cvv}
              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
              inputProps={{ maxLength: 3 }}
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  bgcolor: "#f3f3f5",
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsAddDialogOpen(false)}
            variant="outlined"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCard}
            variant="contained"
            fullWidth
            disabled={!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv}
            sx={{
              background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
                opacity: 0.9,
              },
            }}
          >
            Add Card
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
