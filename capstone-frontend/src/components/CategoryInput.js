import { Box, TextField, Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function CategoryInput({ label, value, field, tooltip, onChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle1">{label}</Typography>
        <Tooltip title={tooltip}>
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </Tooltip>
      </Box>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(field, parseInt(e.target.value) || 0)}
        InputProps={{ startAdornment: '$' }}
        type="number"
      />
    </Box>
  );
}

