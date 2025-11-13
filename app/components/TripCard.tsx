'use client';

import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TripCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TripCard({ id, image, title, location, date, onEdit, onDelete }: TripCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}>
          <LocationOnIcon fontSize="small" />
          <Typography variant="body2">{location}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <CalendarMonthIcon fontSize="small" />
          <Typography variant="body2">{date}</Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<EditIcon />}
          onClick={() => onEdit(id)}
          sx={{ textTransform: 'none' }}
        >
          Edit trip
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => onDelete(id)}
          sx={{ minWidth: 'auto', px: 2.5 }}
        >
          <DeleteIcon />
        </Button>
      </CardActions>
    </Card>
  );
}
