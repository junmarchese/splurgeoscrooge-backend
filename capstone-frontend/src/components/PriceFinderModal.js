import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AveragePriceFinder from './AveragePriceFinder';

export default function PriceFinderModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Average Price Finder</DialogTitle>
      <DialogContent>
        <AveragePriceFinder/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}