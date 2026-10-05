import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { Role, type User } from '../../../types/user'

const dateFormatter = new Intl.DateTimeFormat('pt-BR')
const rowsPerPageOptions = [10, 25, 50, 100]

type UserTableProps = {
  users: User[]
  total: number
  page: number
  rowsPerPage: number
  loading: boolean
  hasActiveFilters: boolean
  onCreate: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const LoadingRow = () => (
  <TableRow>
    <TableCell colSpan={4} align="center" sx={{ py: 9 }}>
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        Carregando usuários...
      </Typography>
    </TableCell>
  </TableRow>
)

type EmptyRowProps = {
  hasActiveFilters: boolean
  onCreate: () => void
  onClearFilters: () => void
}

const EmptyRow = ({ hasActiveFilters, onCreate, onClearFilters }: EmptyRowProps) => (
  <TableRow>
    <TableCell colSpan={4} align="center" sx={{ py: 9 }}>
      <Avatar sx={{ mx: 'auto', mb: 1.5, bgcolor: 'grey.100', color: 'grey.500' }}>
        <GroupsOutlinedIcon />
      </Avatar>
      <Typography sx={{ fontWeight: 700 }}>
        {hasActiveFilters ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {hasActiveFilters
          ? 'Tente alterar ou limpar os filtros da busca.'
          : 'Adicione o primeiro usuário para começar.'}
      </Typography>

      {hasActiveFilters ? (
        <Button
          variant="outlined"
          startIcon={<FilterAltOffRoundedIcon />}
          onClick={onClearFilters}
        >
          Limpar filtros
        </Button>
      ) : (
        <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={onCreate}>
          Adicionar usuário
        </Button>
      )}
    </TableCell>
  </TableRow>
)

type UserRowProps = {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const UserRow = ({ user, onEdit, onDelete }: UserRowProps) => {
  const isAdmin = user.role === Role.admin

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: isAdmin ? '#fff1e8' : '#edf3f8',
              color: isAdmin ? 'primary.dark' : '#35536d',
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Chip
          label={isAdmin ? 'Administrador' : 'Usuário'}
          size="small"
          color={isAdmin ? 'primary' : 'default'}
          variant={isAdmin ? 'filled' : 'outlined'}
        />
      </TableCell>
      <TableCell>{dateFormatter.format(new Date(user.createdAt))}</TableCell>
      <TableCell align="right">
        <Tooltip title="Editar usuário">
          <IconButton aria-label={`Editar ${user.name}`} onClick={() => onEdit(user)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Excluir usuário">
          <IconButton
            aria-label={`Excluir ${user.name}`}
            color="error"
            onClick={() => onDelete(user)}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

const UserTable = ({
  users,
  total,
  page,
  rowsPerPage,
  loading,
  hasActiveFilters,
  onCreate,
  onEdit,
  onDelete,
  onClearFilters,
  onPageChange,
  onRowsPerPageChange,
}: UserTableProps) => (
  <>
    <TableContainer>
      <Table sx={{ minWidth: 720 }} aria-label="Lista de usuários">
        <TableHead>
          <TableRow>
            <TableCell>Usuário</TableCell>
            <TableCell>Perfil</TableCell>
            <TableCell>Cadastro</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <LoadingRow />
          ) : users.length === 0 ? (
            <EmptyRow
              hasActiveFilters={hasActiveFilters}
              onCreate={onCreate}
              onClearFilters={onClearFilters}
            />
          ) : (
            users.map((user) => (
              <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={total}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      onPageChange={(_, nextPage) => onPageChange(nextPage)}
      onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      labelRowsPerPage="Itens por página"
    />
  </>
)

export default UserTable
