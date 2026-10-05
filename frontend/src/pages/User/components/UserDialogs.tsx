import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from '@mui/material'
import type { User, UserInput } from '../../../types/user'

export type Feedback = {
  severity: 'success' | 'error'
  message: string
}

type EditConfirmationDialogProps = {
  user?: UserInput
  saving: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const EditConfirmationDialog = ({
  user,
  saving,
  onCancel,
  onConfirm,
}: EditConfirmationDialogProps) => (
  <Dialog open={Boolean(user)} onClose={() => !saving && onCancel()} maxWidth="xs" fullWidth>
    <DialogTitle>Confirmar alterações?</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">
        Os dados de <strong>{user?.name}</strong> serão atualizados. Deseja continuar?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5 }}>
      <Button color="inherit" onClick={onCancel} disabled={saving}>
        Cancelar
      </Button>
      <Button variant="contained" onClick={onConfirm} loading={saving}>
        Confirmar e salvar
      </Button>
    </DialogActions>
  </Dialog>
)

type DeleteConfirmationDialogProps = {
  user?: User
  saving: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteConfirmationDialog = ({
  user,
  saving,
  onCancel,
  onConfirm,
}: DeleteConfirmationDialogProps) => (
  <Dialog open={Boolean(user)} onClose={() => !saving && onCancel()} maxWidth="xs" fullWidth>
    <DialogTitle>Excluir usuário?</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">
        Esta ação removerá <strong>{user?.name}</strong> do sistema e não poderá ser desfeita.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5 }}>
      <Button color="inherit" onClick={onCancel} disabled={saving}>
        Cancelar
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm} loading={saving}>
        Excluir usuário
      </Button>
    </DialogActions>
  </Dialog>
)

type FeedbackSnackbarProps = {
  feedback?: Feedback
  onClose: () => void
}

export const FeedbackSnackbar = ({ feedback, onClose }: FeedbackSnackbarProps) => (
  <Snackbar
    open={Boolean(feedback)}
    autoHideDuration={4500}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert
      severity={feedback?.severity ?? 'success'}
      variant="filled"
      onClose={onClose}
      sx={{ width: '100%' }}
    >
      {feedback?.message}
    </Alert>
  </Snackbar>
)
