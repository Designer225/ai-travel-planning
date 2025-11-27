import { Box, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card sx={{
      maxWidth: 345,
      minHeight: 300
    }}>
      <CardContent>
        <Box textAlign='center'>
          <Box width={64} height={64} bgcolor="#dbeafe" borderRadius="calc(infinity * 1px)" display={'flex'}
            alignItems="center" justifyContent='center' marginInline="auto" marginBottom={4} aria-hidden={true}>
            <Icon style={{
              width: 32,
              height: 64,
              color: "#0000ff99",
              margin: "auto"
            }} />
          </Box>
          <Typography variant='h3' fontSize='1.5rem' lineHeight="calc(2.0 / 1.5)" marginBottom={3}>
            {title}
          </Typography>
          <Typography variant='body1' className='feature-subtitle'>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
